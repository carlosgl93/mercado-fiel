import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const productosRouter = Router();

// Types for request bodies
interface CreateProductoRequest {
  id_proveedor: number;
  id_categoria: number;
  nombre_producto: string;
  descripcion?: string;
  precio_unitario: number;
  imagen_url?: string;
  disponible?: boolean;
  descuentos_cantidad?: {
    cantidad_minima: number;
    descuento_porcentaje?: number;
    precio_descuento?: number;
  }[];
}

interface UpdateProductoRequest {
  id_categoria?: number;
  nombre_producto?: string;
  descripcion?: string;
  precio_unitario?: number;
  imagen_url?: string;
  disponible?: boolean;
}

// Helper function to safely parse query parameters
const parseQueryParam = (param: unknown): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0] || '';
  return '';
};

const parseNumberParam = (param: unknown, defaultValue: number): number => {
  const parsed = parseInt(parseQueryParam(param));
  return isNaN(parsed) ? defaultValue : parsed;
};

// GET /productos - List products with pagination and filtering
productosRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseNumberParam(req.query.page, 1);
    const limit = parseNumberParam(req.query.limit, 10);
    const search = parseQueryParam(req.query.search);
    const categoria = parseQueryParam(req.query.categoria);
    const proveedor = parseQueryParam(req.query.proveedor);
    const disponible = parseQueryParam(req.query.disponible);
    const sortBy = parseQueryParam(req.query.sortBy) || 'created_at';
    const sortOrder = parseQueryParam(req.query.sortOrder) || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.productosWhereInput = {};

    if (search) {
      where.OR = [
        { nombre_producto: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        {
          proveedor: {
            nombre_negocio: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    if (categoria) {
      where.id_categoria = parseInt(categoria);
    }

    if (proveedor) {
      where.id_proveedor = parseInt(proveedor);
    }

    if (disponible !== '') {
      where.disponible = disponible === 'true';
    }

    // Build orderBy
    const orderBy: Prisma.productosOrderByWithRelationInput = {};
    if (
      sortBy === 'created_at' ||
      sortBy === 'updated_at' ||
      sortBy === 'nombre_producto' ||
      sortBy === 'precio_unitario'
    ) {
      orderBy[sortBy as keyof Prisma.productosOrderByWithRelationInput] = sortOrder as
        | 'asc'
        | 'desc';
    }

    const [productos, total] = await Promise.all([
      prisma.productos.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          proveedor: {
            select: {
              id_proveedor: true,
              nombre_negocio: true,
              destacado: true,
              usuario: {
                select: {
                  nombre: true,
                  email: true,
                },
              },
            },
          },
          categoria: {
            select: {
              id_categoria: true,
              nombre: true,
            },
          },
          descuentos_cantidad: {
            where: { activo: true },
            orderBy: { cantidad_minima: 'asc' },
          },
          _count: {
            select: {
              comentarios: true,
              campanas_colectivas: true,
              lista_deseos: true,
            },
          },
        },
      }),
      prisma.productos.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        productos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /productos/:id - Get product by ID
productosRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const includeStats = parseQueryParam(req.query.includeStats) === 'true';

      const includeOptions: Prisma.productosInclude = {
        proveedor: {
          select: {
            id_proveedor: true,
            nombre_negocio: true,
            descripcion: true,
            destacado: true,
            telefono_contacto: true,
            email: true,
            usuario: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
        categoria: true,
        descuentos_cantidad: {
          where: { activo: true },
          orderBy: { cantidad_minima: 'asc' },
        },
        _count: {
          select: {
            comentarios: true,
            campanas_colectivas: true,
            lista_deseos: true,
          },
        },
      };

      if (includeStats) {
        includeOptions.comentarios = {
          include: {
            cliente: {
              select: {
                nombre: true,
                profile_picture_url: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 10,
        };
        includeOptions.campanas_colectivas = {
          select: {
            id_campana: true,
            nombre: true,
            estado: true,
            precio_objetivo: true,
            cantidad_objetivo: true,
            fecha_inicio: true,
            fecha_fin: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
        };
      }

      const producto = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
        include: includeOptions,
      });

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: producto,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /productos - Create new product
productosRouter.post(
  '/',
  async (
    req: Request<Record<string, never>, unknown, CreateProductoRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        id_proveedor,
        id_categoria,
        nombre_producto,
        descripcion,
        precio_unitario,
        imagen_url,
        disponible = true,
        descuentos_cantidad = [],
      } = req.body;

      // Validation
      if (!id_proveedor || !id_categoria || !nombre_producto || !precio_unitario) {
        res.status(400).json({
          success: false,
          message: 'id_proveedor, id_categoria, nombre_producto y precio_unitario son requeridos',
        });
        return;
      }

      // Check if proveedor exists
      const proveedor = await prisma.proveedores.findUnique({
        where: { id_proveedor },
      });

      if (!proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      // Check if categoria exists
      const categoria = await prisma.categorias.findUnique({
        where: { id_categoria },
      });

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      const producto = await prisma.$transaction(async (tx) => {
        // Create the product
        const newProduct = await tx.productos.create({
          data: {
            id_proveedor,
            id_categoria,
            nombre_producto,
            descripcion,
            precio_unitario,
            imagen_url,
            disponible,
          },
        });

        // Create quantity discounts if provided
        if (descuentos_cantidad.length > 0) {
          const validDiscounts = descuentos_cantidad
            .filter(
              (descuento) =>
                descuento.descuento_porcentaje !== undefined ||
                descuento.precio_descuento !== undefined,
            )
            .map((descuento) => {
              const data: any = {
                id_producto: newProduct.id_producto,
                cantidad_minima: descuento.cantidad_minima,
              };

              if (descuento.descuento_porcentaje !== undefined) {
                data.descuento_porcentaje = descuento.descuento_porcentaje;
              }

              if (descuento.precio_descuento !== undefined) {
                data.precio_descuento = descuento.precio_descuento;
              }

              return data;
            });

          if (validDiscounts.length > 0) {
            await tx.descuentos_cantidad.createMany({
              data: validDiscounts,
            });
          }
        }

        // Return product with all relations
        return await tx.productos.findUnique({
          where: { id_producto: newProduct.id_producto },
          include: {
            proveedor: {
              select: {
                nombre_negocio: true,
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
            categoria: {
              select: {
                nombre: true,
              },
            },
          },
        });
      });

      res.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /productos/:id - Update product
productosRouter.put(
  '/:id',
  async (
    req: Request<{ id: string }, unknown, UpdateProductoRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        id_categoria,
        nombre_producto,
        descripcion,
        precio_unitario,
        imagen_url,
        disponible,
      } = req.body;

      // Check if product exists
      const existingProduct = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      // Check if categoria exists if changing
      if (id_categoria && id_categoria !== existingProduct.id_categoria) {
        const categoria = await prisma.categorias.findUnique({
          where: { id_categoria },
        });

        if (!categoria) {
          res.status(404).json({
            success: false,
            message: 'Categoría no encontrada',
          });
          return;
        }
      }

      // Build update data
      const updateData: Prisma.productosUpdateInput = {};
      if (id_categoria !== undefined) updateData.categoria = { connect: { id_categoria } };
      if (nombre_producto !== undefined) updateData.nombre_producto = nombre_producto;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (precio_unitario !== undefined) updateData.precio_unitario = precio_unitario;
      if (imagen_url !== undefined) updateData.imagen_url = imagen_url;
      if (disponible !== undefined) updateData.disponible = disponible;

      const producto = await prisma.productos.update({
        where: { id_producto: parseInt(id) },
        data: updateData,
        include: {
          proveedor: {
            select: {
              nombre_negocio: true,
              usuario: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          categoria: {
            select: {
              nombre: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: producto,
        message: 'Producto actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /productos/:id/disponibilidad - Toggle product availability
productosRouter.patch(
  '/:id/disponibilidad',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { disponible } = req.body;

      if (typeof disponible !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'El campo disponible debe ser un booleano',
        });
        return;
      }

      const producto = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
      });

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      await prisma.productos.update({
        where: { id_producto: parseInt(id) },
        data: { disponible },
      });

      res.json({
        success: true,
        message: `Producto ${disponible ? 'activado' : 'desactivado'} exitosamente`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /productos/:id - Delete product
productosRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const producto = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
      });

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      await prisma.productos.delete({
        where: { id_producto: parseInt(id) },
      });

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }
      next(error);
    }
  },
);

// GET /productos/:id/stats - Get product statistics
productosRouter.get(
  '/:id/stats',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const stats = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
        select: {
          _count: {
            select: {
              comentarios: true,
              campanas_colectivas: true,
              lista_deseos: true,
              items_pedido: true,
            },
          },
          comentarios: {
            select: {
              calificacion: true,
              created_at: true,
            },
          },
        },
      });

      if (!stats) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      // Calculate additional stats
      const reviewStats = {
        total: stats.comentarios.length,
        average:
          stats.comentarios.length > 0
            ? stats.comentarios.reduce((sum, r) => sum + r.calificacion, 0) /
              stats.comentarios.length
            : 0,
      };

      res.json({
        success: true,
        data: {
          counts: stats._count,
          reviews: reviewStats,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /productos/:id/descuentos - Add quantity discounts to product
productosRouter.post(
  '/:id/descuentos',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { descuentos } = req.body;

      if (!descuentos || !Array.isArray(descuentos)) {
        res.status(400).json({
          success: false,
          message: 'Se requiere un array de descuentos',
        });
        return;
      }

      // Check if product exists
      const producto = await prisma.productos.findUnique({
        where: { id_producto: parseInt(id) },
      });

      if (!producto) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      // Validate discounts
      for (const descuento of descuentos) {
        if (!descuento.cantidad_minima || descuento.cantidad_minima < 1) {
          res.status(400).json({
            success: false,
            message: 'La cantidad mínima debe ser mayor a 0',
          });
          return;
        }

        if (!descuento.descuento_porcentaje && !descuento.precio_descuento) {
          res.status(400).json({
            success: false,
            message: 'Debe especificar descuento_porcentaje o precio_descuento',
          });
          return;
        }
      }

      const nuevosDescuentos = await prisma.descuentos_cantidad.createMany({
        data: descuentos.map((descuento: any) => {
          const data: any = {
            id_producto: parseInt(id),
            cantidad_minima: descuento.cantidad_minima,
          };

          if (descuento.descuento_porcentaje !== undefined) {
            data.descuento_porcentaje = descuento.descuento_porcentaje;
          }

          if (descuento.precio_descuento !== undefined) {
            data.precio_descuento = descuento.precio_descuento;
          }

          return data;
        }),
      });

      res.status(201).json({
        success: true,
        data: nuevosDescuentos,
        message: 'Descuentos por cantidad agregados exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /productos/:id/descuentos - Get quantity discounts for product
productosRouter.get(
  '/:id/descuentos',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const descuentos = await prisma.descuentos_cantidad.findMany({
        where: { id_producto: parseInt(id) },
        orderBy: { cantidad_minima: 'asc' },
      });

      res.json({
        success: true,
        data: descuentos,
      });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /productos/:id/descuentos/:descuentoId - Update quantity discount
productosRouter.put(
  '/:id/descuentos/:descuentoId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, descuentoId } = req.params;
      const { cantidad_minima, descuento_porcentaje, precio_descuento, activo } = req.body;

      const descuento = await prisma.descuentos_cantidad.findUnique({
        where: {
          id_descuento: parseInt(descuentoId),
        },
      });

      if (!descuento || descuento.id_producto !== parseInt(id)) {
        res.status(404).json({
          success: false,
          message: 'Descuento no encontrado',
        });
        return;
      }

      const updateData: any = {};
      if (cantidad_minima !== undefined) updateData.cantidad_minima = cantidad_minima;
      if (descuento_porcentaje !== undefined)
        updateData.descuento_porcentaje = descuento_porcentaje;
      if (precio_descuento !== undefined) updateData.precio_descuento = precio_descuento;
      if (activo !== undefined) updateData.activo = activo;

      const descuentoActualizado = await prisma.descuentos_cantidad.update({
        where: { id_descuento: parseInt(descuentoId) },
        data: updateData,
      });

      res.json({
        success: true,
        data: descuentoActualizado,
        message: 'Descuento actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /productos/:id/descuentos/:descuentoId - Delete quantity discount
productosRouter.delete(
  '/:id/descuentos/:descuentoId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, descuentoId } = req.params;

      const descuento = await prisma.descuentos_cantidad.findUnique({
        where: { id_descuento: parseInt(descuentoId) },
      });

      if (!descuento || descuento.id_producto !== parseInt(id)) {
        res.status(404).json({
          success: false,
          message: 'Descuento no encontrado',
        });
        return;
      }

      await prisma.descuentos_cantidad.delete({
        where: { id_descuento: parseInt(descuentoId) },
      });

      res.json({
        success: true,
        message: 'Descuento eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

export { productosRouter };

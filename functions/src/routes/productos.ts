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

      const producto = await prisma.productos.create({
        data: {
          id_proveedor,
          id_categoria,
          nombre_producto,
          descripcion,
          precio_unitario,
          imagen_url,
          disponible,
        },
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

export { productosRouter };

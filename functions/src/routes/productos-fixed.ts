import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const prisma = new PrismaClient();
const productosRouter = Router();

// Types for request bodies
interface CreateProductoRequest {
  id_proveedor: number;
  id_categoria: number;
  nombre_producto: string;
  descripcion?: string;
  precio_unitario: number;
  unit_type?: string;
  imagen_url?: string;
  disponible?: boolean;
  descuentos_cantidad?: {
    cantidad_minima: number;
    descuento_porcentaje?: number;
    precio_descuento?: number;
  }[];
}

// TODO: Use this interface when implementing product update functionality
// interface UpdateProductoRequest {
//   id_categoria?: number;
//   nombre_producto?: string;
//   descripcion?: string;
//   precio_unitario?: number;
//   unit_type?: string;
//   imagen_url?: string;
//   disponible?: boolean;
// }

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
          categoria: true,
          proveedor: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                },
              },
              direccion: {
                include: {
                  comuna: true,
                  region: true,
                },
              },
            },
          },
          descuentos_cantidad: true,
        },
      }),
      prisma.productos.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        productos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /productos - Create new product using Supabase Admin (bypasses RLS)
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
        unit_type = 'unit',
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

      // Verify proveedor exists using Supabase Admin
      const { data: proveedor, error: proveedorError } = await supabaseAdmin
        .from('proveedores')
        .select('id_proveedor')
        .eq('id_proveedor', id_proveedor)
        .single();

      if (proveedorError || !proveedor) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      // Verify categoria exists using Supabase Admin
      const { data: categoria, error: categoriaError } = await supabaseAdmin
        .from('categorias')
        .select('id_categoria')
        .eq('id_categoria', id_categoria)
        .single();

      if (categoriaError || !categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      // Create product using Supabase Admin (bypasses RLS)
      const { data: newProduct, error: productError } = await supabaseAdmin
        .from('productos')
        .insert({
          id_proveedor,
          id_categoria,
          nombre_producto,
          descripcion,
          precio_unitario: precio_unitario.toString(),
          unit_type,
          imagen_url,
          disponible,
        })
        .select(`
          *,
          categoria:categorias(*),
          proveedor:proveedores(
            *,
            usuario:usuarios(nombre),
            direccion:direcciones(
              *,
              comuna:comunas(*),
              region:regiones(*)
            )
          )
        `)
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        res.status(500).json({
          success: false,
          message: 'Error al crear el producto',
          error: productError.message,
        });
        return;
      }

      // Create quantity discounts if provided
      if (descuentos_cantidad.length > 0) {
        const validDiscounts = descuentos_cantidad
          .filter(
            (descuento) =>
              descuento.descuento_porcentaje !== undefined ||
              descuento.precio_descuento !== undefined,
          )
          .map((descuento) => ({
            id_producto: newProduct.id_producto,
            cantidad_minima: descuento.cantidad_minima,
            descuento_porcentaje: descuento.descuento_porcentaje || null,
            precio_descuento: descuento.precio_descuento?.toString() || null,
          }));

        if (validDiscounts.length > 0) {
          const { error: discountError } = await supabaseAdmin
            .from('descuentos_cantidad')
            .insert(validDiscounts);

          if (discountError) {
            console.error('Error creating quantity discounts:', discountError);
            // Don't fail the whole operation, but log the error
          }
        }
      }

      // Fetch the complete product with discounts
      const { data: completeProduct, error: fetchError } = await supabaseAdmin
        .from('productos')
        .select(`
          *,
          categoria:categorias(*),
          proveedor:proveedores(
            *,
            usuario:usuarios(nombre),
            direccion:direcciones(
              *,
              comuna:comunas(*),
              region:regiones(*)
            )
          ),
          descuentos_cantidad(*)
        `)
        .eq('id_producto', newProduct.id_producto)
        .single();

      if (fetchError) {
        console.error('Error fetching complete product:', fetchError);
      }

      res.status(201).json({
        success: true,
        data: completeProduct || newProduct,
      });
    } catch (error) {
      console.error('Unexpected error creating product:', error);
      next(error);
    }
  },
);

// GET /productos/:id - Get product by ID
productosRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const includeStats = req.query.includeStats === 'true';

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: 'ID de producto inválido',
      });
      return;
    }

    const producto = await prisma.productos.findUnique({
      where: { id_producto: productId },
      include: {
        categoria: true,
        proveedor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
            direccion: {
              include: {
                comuna: true,
                region: true,
              },
            },
          },
        },
        descuentos_cantidad: true,
        // Include stats if requested
        ...(includeStats && {
          comentarios: {
            select: {
              calificacion: true,
            },
          },
          items_pedido: {
            select: {
              cantidad: true,
              precio_unitario: true,
            },
          },
        }),
      },
    });

    if (!producto) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
      return;
    }

    // Calculate stats if requested
    let stats = {};
    if (includeStats) {
      const comentarios = (producto as any).comentarios || [];
      const itemsPedido = (producto as any).items_pedido || [];

      const averageRating = comentarios.length > 0
        ? comentarios.reduce((sum: number, comment: any) => sum + comment.calificacion, 0) / comentarios.length
        : 0;

      const totalSold = itemsPedido.reduce((sum: number, item: any) => sum + item.cantidad, 0);
      const totalRevenue = itemsPedido.reduce((sum: number, item: any) => 
        sum + (item.cantidad * parseFloat(item.precio_unitario)), 0);

      stats = {
        averageRating: Math.round(averageRating * 10) / 10,
        totalComments: comentarios.length,
        totalSold,
        totalRevenue,
      };
    }

    res.json({
      success: true,
      data: {
        ...producto,
        ...(includeStats && { stats }),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default productosRouter;

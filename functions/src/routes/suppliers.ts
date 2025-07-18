import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
export const suppliersRouter = Router();

// Types for request bodies
interface CreateSupplierRequest {
  // User data
  nombre: string;
  email: string;
  password?: string; // Optional, will generate if not provided
  // Supplier-specific data
  nombre_negocio: string;
  descripcion?: string;
  telefono_contacto?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  destacado?: boolean;
  email_negocio?: string; // Separate business email
  id_plan?: number;
}

interface UpdateSupplierRequest {
  // User data (optional)
  nombre?: string;
  email?: string;
  password?: string;
  activo?: boolean;
  // Supplier-specific data (optional)
  nombre_negocio?: string;
  descripcion?: string;
  telefono_contacto?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  destacado?: boolean;
  email_negocio?: string;
  id_plan?: number;
}

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to generate random password
const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
};

// Helper function to exclude sensitive fields
const excludeFields = <T extends Record<string, any>>(
  obj: T,
  fields: string[] = ['contrasena_hash'],
): Omit<T, keyof typeof fields> => {
  const objCopy = { ...obj };
  fields.forEach((field) => delete objCopy[field]);
  return objCopy;
};

// GET /suppliers - List suppliers with pagination and filtering
suppliersRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const destacado = req.query.destacado as string;
    const activo = req.query.activo as string;

    // Build where clause
    const where: Prisma.proveedoresWhereInput = {};

    if (search) {
      where.OR = [
        { nombre_negocio: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        {
          usuario: {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (destacado !== undefined) {
      where.destacado = destacado === 'true';
    }

    if (activo !== undefined) {
      where.usuario = {
        ...where.usuario,
        // activo: activo === 'true',
      };
    }

    const [suppliers, total] = await Promise.all([
      prisma.proveedores.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
              email: true,
              activo: true,
              fecha_registro: true,
              plan: {
                select: {
                  nombre: true,
                  precio_mensual: true,
                },
              },
            },
          },
          _count: {
            select: {
              productos: true,
              campanas_colectivas: true,
              suscripciones: true,
            },
          },
        },
      }),
      prisma.proveedores.count({ where }),
    ]);

    // Remove sensitive data from nested user objects
    const sanitizedSuppliers = suppliers.map((supplier) => ({
      ...supplier,
      usuario: excludeFields(supplier.usuario),
    }));

    res.json({
      success: true,
      data: sanitizedSuppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /suppliers/:id - Get supplier by ID
suppliersRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const includeStats = req.query.includeStats === 'true';

      const includeOptions: Prisma.proveedoresInclude = {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            email: true,
            activo: true,
            fecha_registro: true,
            profile_picture_url: true,
            plan: true,
          },
        },
        _count: {
          select: {
            productos: true,
            campanas_colectivas: true,
            suscripciones: true,
            solicitudescontacto: true,
          },
        },
      };

      if (includeStats) {
        includeOptions.productos = {
          select: {
            id_producto: true,
            nombre_producto: true,
            precio_unitario: true,
            disponible: true,
            fecha_publicacion: true,
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
            cantidad_objetivo: true,
            fecha_inicio: true,
            fecha_fin: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
        };
        includeOptions.suscripciones = {
          include: {
            plan: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
        };
      }

      const supplier = await prisma.proveedores.findUnique({
        where: { id_proveedor: parseInt(id) },
        include: includeOptions,
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      const sanitizedSupplier = {
        ...supplier,
        usuario: excludeFields(supplier.usuario),
      };

      res.json({
        success: true,
        data: sanitizedSupplier,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /suppliers - Create a new supplier
suppliersRouter.post(
  '/',
  async (
    req: Request<{}, {}, CreateSupplierRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        // User data
        nombre,
        email,
        password,
        // Supplier data
        nombre_negocio,
        descripcion,
        telefono_contacto,
        direccion,
        latitud,
        longitud,
        destacado = false,
        email_negocio,
        id_plan,
      } = req.body;

      // Validation
      if (!nombre || !email || !nombre_negocio) {
        res.status(400).json({
          success: false,
          message: 'Nombre de usuario, email y nombre del negocio son requeridos.',
        });
        return;
      }

      // Check if email already exists
      const existingUser = await prisma.usuarios.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con este email',
        });
        return;
      }

      // Check if business email already exists (if provided)
      if (email_negocio) {
        const existingBusinessEmail = await prisma.proveedores.findUnique({
          where: { email: email_negocio },
        });

        if (existingBusinessEmail) {
          res.status(400).json({
            success: false,
            message: 'Ya existe un proveedor con este email de negocio',
          });
          return;
        }
      }

      // Generate password if not provided
      const finalPassword = password || generateRandomPassword();
      const contrasena_hash = await hashPassword(finalPassword);

      // Create supplier with user in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user first
        const usuario = await tx.usuarios.create({
          data: {
            nombre,
            email,
            contrasena_hash,
            activo: true,
            id_plan,
          },
        });

        // Assign provider role
        const proveedorRole = await tx.roles.findUnique({
          where: { nombre: 'proveedor' },
        });

        if (proveedorRole) {
          await tx.usuarioRol.create({
            data: {
              id_usuario: usuario.id_usuario,
              id_rol: proveedorRole.id_rol,
            },
          });
        }

        // Also assign customer role (providers can also buy)
        const compradorRole = await tx.roles.findUnique({
          where: { nombre: 'comprador' },
        });

        if (compradorRole) {
          await tx.usuarioRol.create({
            data: {
              id_usuario: usuario.id_usuario,
              id_rol: compradorRole.id_rol,
            },
          });

          // Create client profile too
          await tx.clientes.create({
            data: {
              id_usuario: usuario.id_usuario,
              direccion,
              telefono: telefono_contacto,
            },
          });
        }

        // Create supplier profile
        const proveedor = await tx.proveedores.create({
          data: {
            id_usuario: usuario.id_usuario,
            nombre_negocio,
            descripcion,
            telefono_contacto,
            direccion,
            latitud,
            longitud,
            destacado,
            email: email_negocio,
          },
        });

        // Return supplier with user data
        return await tx.proveedores.findUnique({
          where: { id_proveedor: proveedor.id_proveedor },
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                email: true,
                activo: true,
                fecha_registro: true,
                plan: true,
              },
            },
          },
        });
      });

      const sanitizedSupplier = {
        ...result!,
        usuario: excludeFields(result!.usuario),
        // Include generated password in response if it was auto-generated
        ...(password ? {} : { generated_password: finalPassword }),
      };

      res.status(201).json({
        success: true,
        data: sanitizedSupplier,
        message: password
          ? 'Proveedor creado exitosamente'
          : 'Proveedor creado exitosamente. Se generó una contraseña automática.',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({
          success: false,
          message: 'Email ya está en uso',
        });
        return;
      }
      next(error);
    }
  },
);

// PUT /suppliers/:id - Update supplier
suppliersRouter.put(
  '/:id',
  async (
    req: Request<{ id: string }, {}, UpdateSupplierRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        // User data
        nombre,
        email,
        password,
        activo,
        // Supplier data
        nombre_negocio,
        descripcion,
        telefono_contacto,
        direccion,
        latitud,
        longitud,
        destacado,
        email_negocio,
      } = req.body;

      // Check if supplier exists
      const existingSupplier = await prisma.proveedores.findUnique({
        where: { id_proveedor: parseInt(id) },
        include: {
          usuario: true,
        },
      });

      if (!existingSupplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      // Check email uniqueness if changing email
      if (email && email !== existingSupplier.usuario.email) {
        const emailExists = await prisma.usuarios.findUnique({
          where: { email },
        });

        if (emailExists) {
          res.status(400).json({
            success: false,
            message: 'Ya existe un usuario con este email',
          });
          return;
        }
      }

      // Check business email uniqueness if changing
      if (email_negocio && email_negocio !== existingSupplier.email) {
        const businessEmailExists = await prisma.proveedores.findUnique({
          where: { email: email_negocio },
        });

        if (businessEmailExists && businessEmailExists.id_proveedor !== parseInt(id)) {
          res.status(400).json({
            success: false,
            message: 'Ya existe un proveedor con este email de negocio',
          });
          return;
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        // Update user data if provided
        const userUpdateData: Prisma.usuariosUpdateInput = {};
        if (nombre !== undefined) userUpdateData.nombre = nombre;
        if (email !== undefined) userUpdateData.email = email;
        if (activo !== undefined) userUpdateData.activo = activo;
        // if (id_plan !== undefined) userUpdateData.id_plan = id_plan;

        if (password) {
          userUpdateData.contrasena_hash = await hashPassword(password);
        }

        if (Object.keys(userUpdateData).length > 0) {
          await tx.usuarios.update({
            where: { id_usuario: existingSupplier.id_usuario },
            data: userUpdateData,
          });
        }

        // Update supplier data if provided
        const supplierUpdateData: Prisma.proveedoresUpdateInput = {};
        if (nombre_negocio !== undefined) supplierUpdateData.nombre_negocio = nombre_negocio;
        if (descripcion !== undefined) supplierUpdateData.descripcion = descripcion;
        if (telefono_contacto !== undefined)
          supplierUpdateData.telefono_contacto = telefono_contacto;
        if (direccion !== undefined) supplierUpdateData.direccion = direccion;
        if (latitud !== undefined) supplierUpdateData.latitud = latitud;
        if (longitud !== undefined) supplierUpdateData.longitud = longitud;
        if (destacado !== undefined) supplierUpdateData.destacado = destacado;
        if (email_negocio !== undefined) supplierUpdateData.email = email_negocio;

        if (Object.keys(supplierUpdateData).length > 0) {
          await tx.proveedores.update({
            where: { id_proveedor: parseInt(id) },
            data: supplierUpdateData,
          });
        }

        // Return updated supplier with user data
        return await tx.proveedores.findUnique({
          where: { id_proveedor: parseInt(id) },
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                email: true,
                activo: true,
                fecha_registro: true,
                plan: true,
              },
            },
          },
        });
      });

      const sanitizedSupplier = {
        ...result!,
        usuario: excludeFields(result!.usuario),
      };

      res.json({
        success: true,
        data: sanitizedSupplier,
        message: 'Proveedor actualizado exitosamente',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({
          success: false,
          message: 'Email ya está en uso',
        });
        return;
      }
      next(error);
    }
  },
);

// PATCH /suppliers/:id/status - Toggle supplier status
suppliersRouter.patch(
  '/:id/status',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'El campo activo debe ser un booleano',
        });
        return;
      }

      const supplier = await prisma.proveedores.findUnique({
        where: { id_proveedor: parseInt(id) },
        include: { usuario: true },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      // Update user status
      await prisma.usuarios.update({
        where: { id_usuario: supplier.id_usuario },
        data: { activo },
      });

      res.json({
        success: true,
        message: `Proveedor ${activo ? 'activado' : 'desactivado'} exitosamente`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /suppliers/:id - Delete supplier (soft delete by default)
suppliersRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const hard = req.query.hard === 'true';

      const supplier = await prisma.proveedores.findUnique({
        where: { id_proveedor: parseInt(id) },
        include: { usuario: true },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      if (hard) {
        // Hard delete - remove supplier and user
        await prisma.$transaction(async (tx) => {
          // Delete supplier first
          await tx.proveedores.delete({
            where: { id_proveedor: parseInt(id) },
          });

          // Then delete user (this will cascade to other relations)
          await tx.usuarios.delete({
            where: { id_usuario: supplier.id_usuario },
          });
        });

        res.json({
          success: true,
          message: 'Proveedor eliminado permanentemente',
        });
      } else {
        // Soft delete - just deactivate user
        await prisma.usuarios.update({
          where: { id_usuario: supplier.id_usuario },
          data: { activo: false },
        });

        res.json({
          success: true,
          message: 'Proveedor desactivado exitosamente',
        });
      }
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }
      next(error);
    }
  },
);

// GET /suppliers/:id/stats - Get supplier statistics
suppliersRouter.get(
  '/:id/stats',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const stats = await prisma.proveedores.findUnique({
        where: { id_proveedor: parseInt(id) },
        select: {
          _count: {
            select: {
              productos: true,
              campanas_colectivas: true,
              suscripciones: true,
              solicitudescontacto: true,
            },
          },
          productos: {
            select: {
              precio_unitario: true,
              disponible: true,
              fecha_publicacion: true,
            },
          },
          campanas_colectivas: {
            select: {
              estado: true,
              cantidad_objetivo: true,
              fecha_inicio: true,
            },
          },
        },
      });

      if (!stats) {
        res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
        return;
      }

      // Calculate additional stats
      const productStats = {
        available: stats.productos.filter((p) => p.disponible).length,
        unavailable: stats.productos.filter((p) => !p.disponible).length,
        averagePrice:
          stats.productos.length > 0
            ? stats.productos.reduce((sum, p) => sum + Number(p.precio_unitario), 0) /
              stats.productos.length
            : 0,
      };

      const campaignStats = stats.campanas_colectivas.reduce((acc: any, campaign) => {
        acc[campaign.estado] = (acc[campaign.estado] || 0) + 1;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          counts: stats._count,
          products: productStats,
          campaigns: campaignStats,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // Using bcryptjs instead of bcrypt for better TypeScript support
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Types for request bodies
interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
  activo?: boolean;
  profile_picture_url?: string;
  id_plan?: number;
  roles?: string[];
  proveedor?: {
    nombre_negocio: string;
    descripcion?: string;
    telefono_contacto?: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    email?: string;
  };
  cliente?: {
    direccion?: string;
    telefono?: string;
  };
}

interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  password?: string;
  activo?: boolean;
  profile_picture_url?: string;
  id_plan?: number;
  roles?: string[];
  proveedor?: {
    nombre_negocio?: string;
    descripcion?: string;
    telefono_contacto?: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    email?: string;
  };
  cliente?: {
    direccion?: string;
    telefono?: string;
  };
}

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to exclude sensitive fields
const excludeFields = <T extends Record<string, any>>(
  user: T,
  fields: string[] = ['contrasena_hash'],
): Omit<T, keyof typeof fields> => {
  const userCopy = { ...user };
  fields.forEach((field) => delete userCopy[field]);
  return userCopy;
};

// Helper function to safely parse query parameters
const parseQueryParam = (param: any): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0] || '';
  return '';
};

const parseNumberParam = (param: any, defaultValue: number): number => {
  const parsed = parseInt(parseQueryParam(param));
  return isNaN(parsed) ? defaultValue : parsed;
};

// GET /usuarios - Get all users with filtering and pagination
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseNumberParam(req.query.page, 1);
    const limit = parseNumberParam(req.query.limit, 10);
    const search = parseQueryParam(req.query.search);
    const activo = parseQueryParam(req.query.activo);
    const rol = parseQueryParam(req.query.rol);
    const plan = parseQueryParam(req.query.plan);
    const sortBy = parseQueryParam(req.query.sortBy) || 'created_at';
    const sortOrder = parseQueryParam(req.query.sortOrder) || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.usuariosWhereInput = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (activo) {
      where.activo = activo === 'true';
    }

    if (rol) {
      where.roles = {
        some: {
          rol: {
            nombre: rol,
          },
        },
      };
    }

    if (plan) {
      where.plan = {
        nombre: plan,
      };
    }

    // Build orderBy
    const orderBy: Prisma.usuariosOrderByWithRelationInput = {};
    if (
      sortBy === 'created_at' ||
      sortBy === 'updated_at' ||
      sortBy === 'nombre' ||
      sortBy === 'email'
    ) {
      orderBy[sortBy] = sortOrder as 'asc' | 'desc';
    }

    // Get users with related data
    const [usuarios, total] = await Promise.all([
      prisma.usuarios.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          roles: {
            include: {
              rol: true,
            },
          },
          plan: true,
          proveedor: {
            select: {
              id_proveedor: true,
              nombre_negocio: true,
              destacado: true,
            },
          },
          cliente: {
            select: {
              id_cliente: true,
              direccion: true,
              telefono: true,
            },
          },
          _count: {
            select: {
              comentarios: true,
              pagos: true,
              participaciones: true,
              pedidos: true,
              notificaciones: { where: { leida: false } },
              lista_deseos: true,
            },
          },
        },
      }),
      prisma.usuarios.count({ where }),
    ]);

    // Remove sensitive data
    const sanitizedUsers = usuarios.map((user) => excludeFields(user));

    res.json({
      success: true,
      data: {
        usuarios: sanitizedUsers,
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

// GET /usuarios/:id - Get user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const includeStats = parseQueryParam(req.query.includeStats) === 'true';

    const includeOptions: Prisma.usuariosInclude = {
      roles: {
        include: {
          rol: true,
        },
      },
      plan: true,
      proveedor: true,
      cliente: true,
      _count: {
        select: {
          comentarios: true,
          pagos: true,
          participaciones: true,
          pedidos: true,
          notificaciones: { where: { leida: false } },
          lista_deseos: true,
        },
      },
    };

    if (includeStats) {
      includeOptions.comentarios = {
        include: {
          producto: {
            select: {
              nombre_producto: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      };
      includeOptions.participaciones = {
        include: {
          campana: {
            select: {
              nombre: true,
              estado: true,
              producto: {
                select: {
                  nombre_producto: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      };
      includeOptions.pedidos = {
        select: {
          id_pedido: true,
          tipo_pedido: true,
          total: true,
          estado: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      };
      includeOptions.notificaciones = {
        where: { leida: false },
        orderBy: {
          created_at: 'desc',
        },
        take: 10,
      };
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
      include: includeOptions,
    });

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    const sanitizedUser = excludeFields(usuario);

    res.json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
});

// POST /usuarios - Create new user
router.post(
  '/',
  async (
    req: Request<{}, {}, CreateUserRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        nombre,
        email,
        password,
        activo = true,
        profile_picture_url,
        id_plan,
        roles = ['comprador'], // Default role
        proveedor,
        cliente,
      } = req.body;

      // Validation
      if (!nombre || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son requeridos',
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

      // Hash password
      const contrasena_hash = await hashPassword(password);

      // Start transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const usuario = await tx.usuarios.create({
          data: {
            nombre,
            email,
            contrasena_hash,
            activo,
            profile_picture_url,
            id_plan,
          },
        });

        // Assign roles
        for (const roleName of roles) {
          const rol = await tx.roles.findUnique({
            where: { nombre: roleName },
          });

          if (rol) {
            await tx.usuarioRol.create({
              data: {
                id_usuario: usuario.id_usuario,
                id_rol: rol.id_rol,
              },
            });
          }
        }

        // Create provider profile if data provided
        if (proveedor && roles.includes('proveedor')) {
          await tx.proveedores.create({
            data: {
              id_usuario: usuario.id_usuario,
              ...proveedor,
            },
          });
        }

        // Create client profile if data provided or if has 'comprador' role
        if (cliente || roles.includes('comprador')) {
          await tx.clientes.create({
            data: {
              id_usuario: usuario.id_usuario,
              ...cliente,
            },
          });
        }

        // Return user with relations
        return await tx.usuarios.findUnique({
          where: { id_usuario: usuario.id_usuario },
          include: {
            roles: {
              include: {
                rol: true,
              },
            },
            plan: true,
            proveedor: true,
            cliente: true,
          },
        });
      });

      const sanitizedUser = excludeFields(result!);

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: sanitizedUser,
      });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /usuarios/:id - Update user
router.put(
  '/:id',
  async (
    req: Request<{ id: string }, {}, UpdateUserRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { nombre, email, password, activo, profile_picture_url, roles, proveedor, cliente } =
        req.body;

      // Check if user exists
      const existingUser = await prisma.usuarios.findUnique({
        where: { id_usuario: parseInt(id) },
        include: {
          roles: true,
          proveedor: true,
          cliente: true,
        },
      });

      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Check email uniqueness if changing email
      if (email && email !== existingUser.email) {
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

      // Prepare update data
      const updateData: Prisma.usuariosUpdateInput = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (email !== undefined) updateData.email = email;
      if (activo !== undefined) updateData.activo = activo;
      if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url;
      // if (id_plan !== undefined) updateData.id_plan = id_plan;

      // Hash new password if provided
      if (password) {
        updateData.contrasena_hash = await hashPassword(password);
      }

      const result = await prisma.$transaction(async (tx) => {
        // Update user basic info
        await tx.usuarios.update({
          where: { id_usuario: parseInt(id) },
          data: updateData,
        });

        // Update roles if provided
        if (roles && Array.isArray(roles)) {
          // Remove existing roles
          await tx.usuarioRol.deleteMany({
            where: { id_usuario: parseInt(id) },
          });

          // Add new roles
          for (const roleName of roles) {
            const rol = await tx.roles.findUnique({
              where: { nombre: roleName },
            });

            if (rol) {
              await tx.usuarioRol.create({
                data: {
                  id_usuario: parseInt(id),
                  id_rol: rol.id_rol,
                },
              });
            }
          }
        }

        // Update provider profile if data provided
        if (proveedor) {
          if (existingUser.proveedor) {
            await tx.proveedores.update({
              where: { id_proveedor: existingUser.proveedor.id_proveedor },
              data: proveedor,
            });
          } else {
            await tx.proveedores.create({
              data: {
                nombre_negocio: proveedor.nombre_negocio || '',
                id_usuario: parseInt(id),
                ...proveedor,
              },
            });
          }
        }

        // Update client profile if data provided
        if (cliente) {
          if (existingUser.cliente) {
            await tx.clientes.update({
              where: { id_cliente: existingUser.cliente.id_cliente },
              data: cliente,
            });
          } else {
            await tx.clientes.create({
              data: {
                id_usuario: parseInt(id),
                ...cliente,
              },
            });
          }
        }

        // Return updated user with relations
        return await tx.usuarios.findUnique({
          where: { id_usuario: parseInt(id) },
          include: {
            roles: {
              include: {
                rol: true,
              },
            },
            plan: true,
            proveedor: true,
            cliente: true,
          },
        });
      });

      const sanitizedUser = excludeFields(result!);

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: sanitizedUser,
      });
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /usuarios/:id/status - Toggle user status
router.patch(
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

      const usuario = await prisma.usuarios.update({
        where: { id_usuario: parseInt(id) },
        data: { activo },
        include: {
          roles: {
            include: {
              rol: true,
            },
          },
        },
      });

      const sanitizedUser = excludeFields(usuario);

      res.json({
        success: true,
        message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`,
        data: sanitizedUser,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }
      next(error);
    }
  },
);

// POST /usuarios/:id/roles - Add role to user
router.post(
  '/:id/roles',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { roleName } = req.body;

      if (!roleName) {
        res.status(400).json({
          success: false,
          message: 'Nombre del rol es requerido',
        });
        return;
      }

      // Find role
      const rol = await prisma.roles.findUnique({
        where: { nombre: roleName },
      });

      if (!rol) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
        return;
      }

      // Check if user already has this role
      const existingRole = await prisma.usuarioRol.findUnique({
        where: {
          id_usuario_id_rol: {
            id_usuario: parseInt(id),
            id_rol: rol.id_rol,
          },
        },
      });

      if (existingRole) {
        res.status(400).json({
          success: false,
          message: 'El usuario ya tiene este rol',
        });
        return;
      }

      await prisma.usuarioRol.create({
        data: {
          id_usuario: parseInt(id),
          id_rol: rol.id_rol,
        },
      });

      res.json({
        success: true,
        message: `Rol ${roleName} agregado exitosamente`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /usuarios/:id/roles/:roleId - Remove role from user
router.delete(
  '/:id/roles/:roleId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, roleId } = req.params;

      await prisma.usuarioRol.delete({
        where: {
          id_usuario_id_rol: {
            id_usuario: parseInt(id),
            id_rol: parseInt(roleId),
          },
        },
      });

      res.json({
        success: true,
        message: 'Rol removido exitosamente',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado para este usuario',
        });
        return;
      }
      next(error);
    }
  },
);

// DELETE /usuarios/:id - Soft delete user (deactivate)
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const hard = parseQueryParam(req.query.hard) === 'true';

    if (hard) {
      // Hard delete - remove user and all related data
      await prisma.$transaction(async (tx) => {
        // Delete in order to respect foreign key constraints
        await tx.usuarioRol.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.participanteColectivo.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.notificaciones.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.lista_deseos.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.comentarios.deleteMany({ where: { id_cliente: parseInt(id) } });
        await tx.solicitudescontacto.deleteMany({ where: { id_cliente: parseInt(id) } });
        await tx.pagos.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.pedidos.deleteMany({ where: { id_usuario: parseInt(id) } });

        // Delete provider/client profiles
        await tx.proveedores.deleteMany({ where: { id_usuario: parseInt(id) } });
        await tx.clientes.deleteMany({ where: { id_usuario: parseInt(id) } });

        // Finally delete user
        await tx.usuarios.delete({ where: { id_usuario: parseInt(id) } });
      });

      res.json({
        success: true,
        message: 'Usuario eliminado permanentemente',
      });
    } else {
      // Soft delete - just deactivate
      const usuario = await prisma.usuarios.update({
        where: { id_usuario: parseInt(id) },
        data: { activo: false },
      });

      const sanitizedUser = excludeFields(usuario);

      res.json({
        success: true,
        message: 'Usuario desactivado exitosamente',
        data: sanitizedUser,
      });
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }
    next(error);
  }
});

// GET /usuarios/:id/stats - Get user statistics
router.get('/:id/stats', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const stats = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
      select: {
        _count: {
          select: {
            comentarios: true,
            pagos: true,
            participaciones: true,
            pedidos: true,
            notificaciones: true,
            lista_deseos: true,
          },
        },
        pagos: {
          select: {
            monto: true,
            estado: true,
          },
        },
        participaciones: {
          select: {
            monto_aportado: true,
            estado: true,
          },
        },
        pedidos: {
          select: {
            total: true,
            estado: true,
          },
        },
      },
    });

    if (!stats) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Calculate additional stats
    const totalSpent = stats.pagos
      .filter((p: any) => p.estado === 'completado')
      .reduce((sum: number, p: any) => sum + Number(p.monto), 0);

    const totalCollectiveContributions = stats.participaciones.reduce(
      (sum: number, p: any) => sum + Number(p.monto_aportado),
      0,
    );

    const orderStats = stats.pedidos.reduce((acc: any, pedido: any) => {
      acc[pedido.estado] = (acc[pedido.estado] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        counts: stats._count,
        financial: {
          totalSpent,
          totalCollectiveContributions,
          averageOrderValue:
            stats.pedidos.length > 0
              ? stats.pedidos.reduce((sum: number, p: any) => sum + Number(p.total), 0) /
                stats.pedidos.length
              : 0,
        },
        orders: orderStats,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as usersRouter };

import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
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
  roles?: string[]; // Array of role names
}

interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  password?: string;
  activo?: boolean;
  profile_picture_url?: string;
  id_plan?: number;
  roles?: string[]; // Array of role names
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

// GET /users - Get all users with filtering and pagination
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseNumberParam(req.query.page, 1);
    const limit = parseNumberParam(req.query.limit, 10);
    const search = parseQueryParam(req.query.search);
    const activo = parseQueryParam(req.query.activo);
    const rol = parseQueryParam(req.query.rol);
    const plan = parseQueryParam(req.query.plan);
    const sortBy = parseQueryParam(req.query.sortBy) || 'fecha_registro';
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

    if (activo !== '' && activo !== undefined) {
      where.activo = activo === 'true';
    }

    if (plan) {
      where.id_plan = parseInt(plan);
    }

    // Filter by role
    if (rol) {
      where.roles = {
        some: {
          rol: {
            nombre: rol,
          },
        },
      };
    }

    // Build orderBy
    const orderBy: Prisma.usuariosOrderByWithRelationInput = {};
    if (sortBy === 'fecha_registro' || sortBy === 'updated_at') {
      orderBy[sortBy] = sortOrder as 'asc' | 'desc';
    } else if (sortBy === 'nombre' || sortBy === 'email') {
      orderBy[sortBy] = sortOrder as 'asc' | 'desc';
    } else {
      orderBy.fecha_registro = 'desc';
    }

    const [users, total] = await Promise.all([
      prisma.usuarios.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        include: {
          plan: true,
          roles: {
            include: {
              rol: true,
            },
          },
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
              telefono: true,
            },
          },
        },
      }),
      prisma.usuarios.count({ where }),
    ]);

    // Transform the users data to include roles array and sanitize
    const sanitizedUsers = users.map((user) => {
      const { roles: rolesRelation, ...userData } = user;
      return {
        ...excludeFields(userData),
        roles: rolesRelation.map((ur) => ur.rol.nombre),
        has_proveedor: !!user.proveedor,
        has_cliente: !!user.cliente,
      };
    });

    res.json({
      success: true,
      data: sanitizedUsers,
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

// GET /users/:id - Get specific user
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
      include: {
        plan: true,
        roles: {
          include: {
            rol: true,
          },
        },
        proveedor: {
          include: {
            direccion: {
              include: {
                comuna: {
                  include: {
                    region: true,
                  },
                },
              },
            },
          },
        },
        cliente: {
          include: {
            direccion: {
              include: {
                comuna: {
                  include: {
                    region: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Transform the user data
    const { roles: rolesRelation, ...userData } = user;
    const sanitizedUser = {
      ...excludeFields(userData),
      roles: rolesRelation.map((ur) => ur.rol.nombre),
    };

    res.json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
});

// POST /users - Create a new user
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      nombre,
      email,
      password,
      activo = true,
      profile_picture_url,
      id_plan,
      roles = ['comprador'], // Default role
    } = req.body as CreateUserRequest;

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

    // Create user with roles in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.usuarios.create({
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
      if (roles && roles.length > 0) {
        for (const roleName of roles) {
          const role = await tx.roles.findUnique({
            where: { nombre: roleName },
          });

          if (role) {
            await tx.usuarioRol.create({
              data: {
                id_usuario: user.id_usuario,
                id_rol: role.id_rol,
              },
            });
          }
        }
      }

      // Return user with roles
      return await tx.usuarios.findUnique({
        where: { id_usuario: user.id_usuario },
        include: {
          plan: true,
          roles: {
            include: {
              rol: true,
            },
          },
        },
      });
    });

    const { roles: rolesRelation, ...userData } = result!;
    const sanitizedUser = {
      ...excludeFields(userData),
      roles: rolesRelation.map((ur) => ur.rol.nombre),
    };

    res.status(201).json({
      success: true,
      data: sanitizedUser,
      message: 'Usuario creado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update user
router.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, password, activo, profile_picture_url, id_plan, roles } =
      req.body as UpdateUserRequest;

    // Check if user exists
    const existingUser = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Check email uniqueness if email is being updated
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

    // Update user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: Prisma.usuariosUpdateInput = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (email !== undefined) updateData.email = email;
      if (password !== undefined) updateData.contrasena_hash = await hashPassword(password);
      if (activo !== undefined) updateData.activo = activo;
      if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url;
      if (id_plan !== undefined) {
        updateData.plan = id_plan ? { connect: { id_plan } } : { disconnect: true };
      }

      // Update user
      await tx.usuarios.update({
        where: { id_usuario: parseInt(id) },
        data: updateData,
      });

      // Update roles if provided
      if (roles !== undefined) {
        // Remove existing roles
        await tx.usuarioRol.deleteMany({
          where: { id_usuario: parseInt(id) },
        });

        // Add new roles
        for (const roleName of roles) {
          const role = await tx.roles.findUnique({
            where: { nombre: roleName },
          });

          if (role) {
            await tx.usuarioRol.create({
              data: {
                id_usuario: parseInt(id),
                id_rol: role.id_rol,
              },
            });
          }
        }
      }

      // Return updated user with roles
      return await tx.usuarios.findUnique({
        where: { id_usuario: parseInt(id) },
        include: {
          plan: true,
          roles: {
            include: {
              rol: true,
            },
          },
        },
      });
    });

    const { roles: rolesRelation, ...userData } = result!;
    const sanitizedUser = {
      ...excludeFields(userData),
      roles: rolesRelation.map((ur) => ur.rol.nombre),
    };

    res.json({
      success: true,
      data: sanitizedUser,
      message: 'Usuario actualizado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

// POST /users/:id/roles - Assign role to user
router.post(
  '/:id/roles',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { role_name } = req.body;

      if (!role_name) {
        res.status(400).json({
          success: false,
          message: 'role_name es requerido',
        });
        return;
      }

      // Check if user exists
      const user = await prisma.usuarios.findUnique({
        where: { id_usuario: parseInt(id) },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Check if role exists
      const role = await prisma.roles.findUnique({
        where: { nombre: role_name },
      });

      if (!role) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
        return;
      }

      // Check if user already has this role
      const existingAssignment = await prisma.usuarioRol.findUnique({
        where: {
          id_usuario_id_rol: {
            id_usuario: parseInt(id),
            id_rol: role.id_rol,
          },
        },
      });

      if (existingAssignment) {
        res.status(400).json({
          success: false,
          message: 'El usuario ya tiene este rol asignado',
        });
        return;
      }

      // Assign role
      await prisma.usuarioRol.create({
        data: {
          id_usuario: parseInt(id),
          id_rol: role.id_rol,
        },
      });

      res.json({
        success: true,
        message: `Rol '${role_name}' asignado exitosamente al usuario`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /users/:id/roles/:role_name - Remove role from user
router.delete(
  '/:id/roles/:role_name',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, role_name } = req.params;

      // Get role ID
      const role = await prisma.roles.findUnique({
        where: { nombre: role_name },
      });

      if (!role) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
        return;
      }

      // Remove role assignment
      const deleted = await prisma.usuarioRol.deleteMany({
        where: {
          id_usuario: parseInt(id),
          id_rol: role.id_rol,
        },
      });

      if (deleted.count === 0) {
        res.status(404).json({
          success: false,
          message: 'El usuario no tiene este rol asignado',
        });
        return;
      }

      res.json({
        success: true,
        message: `Rol '${role_name}' removido exitosamente del usuario`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /users/:id - Delete user (soft delete by deactivating)
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Soft delete by deactivating the user
    await prisma.usuarios.update({
      where: { id_usuario: parseInt(id) },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: 'Usuario desactivado correctamente',
    });
  } catch (error) {
    next(error);
  }
});

// GET /users/:id/stats - Get user statistics
router.get('/:id/stats', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
      include: {
        proveedor: true,
        cliente: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    const stats: any = {
      user_info: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        fecha_registro: user.fecha_registro,
        activo: user.activo,
      },
    };

    // Provider stats
    if (user.proveedor) {
      const [productCount, totalSales] = await Promise.all([
        prisma.productos.count({
          where: { id_proveedor: user.proveedor.id_proveedor },
        }),
        // Note: You might need to add a ventas/sales table to track actual sales
        // For now, this is a placeholder
        Promise.resolve(0),
      ]);

      stats.proveedor_stats = {
        total_productos: productCount,
        total_ventas: totalSales,
        destacado: user.proveedor.destacado,
      };
    }

    // Customer stats
    if (user.cliente) {
      // Note: You might need to add a compras/purchases table to track purchases
      // For now, this is a placeholder
      stats.cliente_stats = {
        total_compras: 0,
        fecha_ultima_compra: null,
      };
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

export { router as usersRouter };

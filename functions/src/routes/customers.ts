import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
export const customersRouter = Router();

// Types for request bodies
interface CreateCustomerRequest {
  id_usuario: number;
  telefono?: string;
  id_direccion?: number;
}

interface UpdateCustomerRequest {
  telefono?: string;
  id_direccion?: number;
}

// Helper function to exclude sensitive fields
const excludeFields = <T extends Record<string, unknown>>(
  obj: T,
  fields: string[] = ['contrasena_hash'],
): Omit<T, keyof typeof fields> => {
  const objCopy = { ...obj };
  fields.forEach((field) => delete objCopy[field]);
  return objCopy;
};

// GET /customers - List customers with pagination and filtering
customersRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const comunaId = parseInt((req.query?.comunaId as string) || '');
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    // Build filter conditions
    const where: Prisma.clientesWhereInput = {};

    // Filter by comuna if provided
    if (comunaId) {
      where.direccion = {
        id_comuna: comunaId,
      };
    }
    // TODO: implement customer interested in category filtering
    // if (categoryId) {
    //   where.productos = {
    //     some: {
    //       categoria: {
    //         id_categoria: categoryId,
    //       },
    //     },
    //   };
    // }

    // Filter by search term (search in user name or email)
    if (search) {
      where.usuario = {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
        activo: true,
      };
    } else {
      // Only include active users
      where.usuario = {
        activo: true,
      };
    }

    const [customers, total] = await Promise.all([
      prisma.clientes.findMany({
        skip,
        take: limit,
        where: {
          ...where,
          usuario: {
            activo: true,
          },
        },
        orderBy: { created_at: 'desc' },
        include: {
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
              email: true,
              activo: true,
              fecha_registro: true,
              plan: true,
              profile_picture_url: true,
            },
          },
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
      }),
      prisma.clientes.count({ where }),
    ]);
    // Sanitize user data
    const sanitizedCustomers = customers.map((customer) => ({
      ...customer,
      usuario: excludeFields(customer.usuario),
    }));

    res.json({
      success: true,
      data: sanitizedCustomers,
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

// GET /customers/:id - Get specific customer
customersRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const customer = await prisma.clientes.findUnique({
        where: { id_cliente: parseInt(id) },
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
      });

      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      const sanitizedCustomer = {
        ...customer,
        usuario: excludeFields(customer.usuario),
      };

      res.json({
        success: true,
        data: sanitizedCustomer,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /customers - Create a new customer profile for existing user
customersRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id_usuario, telefono, id_direccion } = req.body as CreateCustomerRequest;

      // Validation
      if (!id_usuario) {
        res.status(400).json({
          success: false,
          message: 'id_usuario es requerido',
        });
        return;
      }

      // Check if user exists
      const existingUser = await prisma.usuarios.findUnique({
        where: { id_usuario },
      });

      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Check if customer already exists for this user
      const existingCustomer = await prisma.clientes.findUnique({
        where: { id_usuario },
      });

      if (existingCustomer) {
        res.status(400).json({
          success: false,
          message: 'Este usuario ya tiene un perfil de cliente',
        });
        return;
      }

      // Create customer in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create customer profile
        const cliente = await tx.clientes.create({
          data: {
            id_usuario,
            telefono,
            id_direccion,
          },
        });

        // Assign customer role if not already assigned
        const clienteRole = await tx.roles.findUnique({
          where: { nombre: 'comprador' },
        });

        if (clienteRole) {
          await tx.usuarioRol.upsert({
            where: {
              id_usuario_id_rol: {
                id_usuario,
                id_rol: clienteRole.id_rol,
              },
            },
            update: {},
            create: {
              id_usuario,
              id_rol: clienteRole.id_rol,
            },
          });
        }

        // Return customer with user data
        return await tx.clientes.findUnique({
          where: { id_cliente: cliente.id_cliente },
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

      if (!result) {
        throw new Error('Error creating customer');
      }

      const sanitizedCustomer = {
        ...result,
        usuario: excludeFields(result.usuario),
      };

      res.status(201).json({
        success: true,
        data: sanitizedCustomer,
        message: 'Cliente creado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /customers/:id - Update customer
customersRouter.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { telefono, id_direccion } = req.body as UpdateCustomerRequest;

      // Check if customer exists
      const existingCustomer = await prisma.clientes.findUnique({
        where: { id_cliente: parseInt(id) },
        include: {
          usuario: true,
        },
      });

      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      // Update customer data
      const customerUpdateData: Prisma.clientesUpdateInput = {};
      if (telefono !== undefined) customerUpdateData.telefono = telefono;
      if (id_direccion !== undefined) {
        customerUpdateData.direccion = id_direccion
          ? { connect: { id_direccion } }
          : { disconnect: true };
      }

      const updatedCustomer = await prisma.clientes.update({
        where: { id_cliente: parseInt(id) },
        data: customerUpdateData,
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
      });

      const sanitizedCustomer = {
        ...updatedCustomer,
        usuario: excludeFields(updatedCustomer.usuario),
      };

      res.json({
        success: true,
        data: sanitizedCustomer,
        message: 'Cliente actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /customers/:id - Delete customer (soft delete by deactivating user)
customersRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const customer = await prisma.clientes.findUnique({
        where: { id_cliente: parseInt(id) },
        include: { usuario: true },
      });

      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
        return;
      }

      // Instead of hard delete, deactivate the user
      await prisma.usuarios.update({
        where: { id_usuario: customer.id_usuario },
        data: { activo: false },
      });

      res.json({
        success: true,
        message: 'Cliente desactivado correctamente',
      });
    } catch (error) {
      next(error);
    }
  },
);

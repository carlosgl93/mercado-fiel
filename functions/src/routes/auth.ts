import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
export const authRouter = Router();

// Types for request bodies
interface SignupCustomerRequest {
  email: string;
  nombre: string;
  telefono?: string;
}

interface SignupSupplierRequest {
  email: string;
  nombre: string;
  telefono_contacto?: string;
  nombre_negocio?: string;
  descripcion?: string;
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

// POST /auth/signup/customer - Create customer account
authRouter.post(
  '/signup/customer',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, nombre, telefono } = req.body as SignupCustomerRequest;

      // Validation
      if (!email || !nombre) {
        res.status(400).json({
          success: false,
          message: 'Email y nombre son requeridos',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.usuarios.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'El email ya está registrado',
        });
        return;
      }

      // Create user first (password will be managed by Supabase)
      const user = await prisma.usuarios.create({
        data: {
          nombre,
          email: email.toLowerCase(),
          contrasena_hash: '', // Supabase handles authentication
          activo: true,
          // Note: auth_uid will be updated when user logs in via Supabase webhook/RLS sync
        },
      });

      // Create customer profile
      const customer = await prisma.clientes.create({
        data: {
          id_usuario: user.id_usuario,
          telefono,
        },
      });

      // Return user data without sensitive fields
      const sanitizedUser = excludeFields(user);

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: {
          user: sanitizedUser,
          customer,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /auth/signup/supplier - Create supplier account
authRouter.post(
  '/signup/supplier',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, nombre, telefono_contacto, nombre_negocio, descripcion } =
        req.body as SignupSupplierRequest;

      // Validation
      if (!email || !nombre) {
        res.status(400).json({
          success: false,
          message: 'Email y nombre son requeridos',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.usuarios.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'El email ya está registrado',
        });
        return;
      }

      // Create user first
      const user = await prisma.usuarios.create({
        data: {
          nombre,
          email: email.toLowerCase(),
          contrasena_hash: '', // Supabase handles authentication
          activo: true,
        },
      });

      // Create supplier profile
      const supplier = await prisma.proveedores.create({
        data: {
          id_usuario: user.id_usuario,
          nombre_negocio: nombre_negocio || nombre,
          descripcion: descripcion || '',
          telefono_contacto,
          destacado: false,
          cobra_envio: true,
          radio_entrega_km: 10,
        },
      });

      // Return user data without sensitive fields
      const sanitizedUser = excludeFields(user);

      res.status(201).json({
        success: true,
        message: 'Proveedor creado exitosamente',
        data: {
          user: sanitizedUser,
          supplier,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /auth/user/:email - Get user by email (for Supabase integration)
authRouter.get(
  '/user/:email',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.params;

      console.log(`Fetching user by email: ${email}`);

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email es requerido',
        });
        return;
      }

      const user = await prisma.usuarios.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          fecha_registro: true,
          activo: true,
          profile_picture_url: true,
          id_plan: true,
          created_at: true,
          updated_at: true,
          auth_uid: true,
          cliente: {
            select: {
              id_cliente: true,
              telefono: true,
              id_direccion: true,
              fecha_registro: true,
              created_at: true,
              updated_at: true,
            },
          },
          proveedor: {
            select: {
              id_proveedor: true,
              nombre_negocio: true,
              descripcion: true,
              telefono_contacto: true,
              id_direccion: true,
              destacado: true,
              email: true,
              radio_entrega_km: true,
              cobra_envio: true,
              envio_gratis_desde: true,
              created_at: true,
              updated_at: true,
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

      // Properly handle nullable updated_at field and exclude sensitive fields
      const sanitizedUser = {
        ...user,
        updated_at: user.updated_at || null,
        cliente: user.cliente
          ? {
              ...user.cliente,
              updated_at: user.cliente.updated_at || null,
            }
          : null,
        proveedor: user.proveedor
          ? {
              ...user.proveedor,
              updated_at: user.proveedor.updated_at || null,
            }
          : null,
      };

      res.json({
        success: true,
        data: sanitizedUser,
      });
    } catch (error) {
      console.error('Error in /auth/user/:email:', error);
      next(error);
    }
  },
);

import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
export const customersRouter = Router();

// GET /customers - List users with pagination
customersRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.usuarios.findMany({
        skip,
        take: limit,
        where: {
          activo: true,
          cliente: {
            isNot: null,
          },
          proveedor: null,
        },
        orderBy: { created_at: 'desc' },
        include: {
          cliente: true,
        },
      }),
      prisma.usuarios.count(),
    ]);

    res.json({
      success: true,
      data: users,
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

// POST /customers - Create a new user
customersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, contrasena_hash, tipo_usuario } = req.body;
    if (!nombre || !email || !contrasena_hash || !tipo_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email, contraseña y tipo_usuario son requeridos.',
      });
    }
    const newUser = await prisma.usuarios.create({
      data: {
        nombre,
        email,
        contrasena_hash,
        activo: true,
      },
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    return next(error);
  }
});

// PUT /customers/:id - Update user
customersRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, email, contrasena_hash, activo } = req.body;
    const updatedUser = await prisma.usuarios.update({
      where: { id_usuario: parseInt(id) },
      data: {
        nombre,
        email,
        contrasena_hash,
        activo,
      },
    });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// DELETE /customers/:id - Delete user
customersRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.usuarios.delete({ where: { id_usuario: parseInt(id) } });
    res.json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
});

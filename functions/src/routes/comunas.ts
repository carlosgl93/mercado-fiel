import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
export const comunasRouter = Router();
// Status endpoint with validation and logging
comunasRouter.get('/', async (req, res, next) => {
  try {
    const comunas = await prisma.comunas.findMany({
      orderBy: { nombre: 'asc' },
    });

    // Consistent response format
    res.json({
      success: true,
      data: comunas,
    });
  } catch (error) {
    // Pass error to centralized handler
    next(error);
  }
});

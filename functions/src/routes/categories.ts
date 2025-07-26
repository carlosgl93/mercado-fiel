import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
export const categoriesRouter = Router();
// Status endpoint with validation and logging
categoriesRouter.get('/', async (req, res, next) => {
  try {
    const cats = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });

    // Consistent response format
    res.json({
      success: true,
      data: cats,
    });
  } catch (error) {
    // Pass error to centralized handler
    next(error);
  }
});

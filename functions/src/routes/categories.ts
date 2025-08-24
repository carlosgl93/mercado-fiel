import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { logger } from 'firebase-functions';

const prisma = new PrismaClient();
export const categoriesRouter = Router();

// Get all categories
categoriesRouter.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });
    logger.log(`Fetched ${categories.length} categories`);

    res.json({
      success: true,
      data: categories,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Get category by ID
categoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido',
      });
    }

    const category = await prisma.categorias.findUnique({
      where: { id_categoria: id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }

    res.json({
      success: true,
      data: category,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Create new category
categoriesRouter.post('/', async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido',
      });
    }

    // Check if category already exists
    const existingCategory = await prisma.categorias.findFirst({
      where: { nombre },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre',
      });
    }

    const category = await prisma.categorias.create({
      data: {
        nombre,
      },
    });

    logger.log(`Created new category: ${category.nombre}`);

    res.status(201).json({
      success: true,
      data: category,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Update category
categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido',
      });
    }

    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido',
      });
    }

    // Check if category exists
    const existingCategory = await prisma.categorias.findUnique({
      where: { id_categoria: id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }

    // Check if name conflicts with another category
    const nameConflict = await prisma.categorias.findFirst({
      where: {
        nombre,
        id_categoria: { not: id },
      },
    });

    if (nameConflict) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre',
      });
    }

    const updatedCategory = await prisma.categorias.update({
      where: { id_categoria: id },
      data: { nombre },
    });

    logger.log(`Updated category: ${updatedCategory.nombre}`);

    res.json({
      success: true,
      data: updatedCategory,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Delete category
categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido',
      });
    }

    // Check if category exists
    const existingCategory = await prisma.categorias.findUnique({
      where: { id_categoria: id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }

    // Check if category has products
    const productsCount = await prisma.productos.count({
      where: { id_categoria: id },
    });

    if (productsCount > 0) {
      return res.status(409).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)`,
      });
    }

    await prisma.categorias.delete({
      where: { id_categoria: id },
    });

    logger.log(`Deleted category: ${existingCategory.nombre}`);

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

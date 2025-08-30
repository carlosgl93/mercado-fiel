import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { logger } from 'firebase-functions';

const prisma = new PrismaClient();
export const carritoRouter = Router();

// Types for request bodies
interface AddToCartRequest {
  id_producto: number;
  cantidad: number;
  precio_unitario?: number; // For discounted prices
}

interface UpdateCartItemRequest {
  cantidad: number;
  precio_unitario?: number;
}

// GET /carrito/:userId - Get user's cart
carritoRouter.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }

    const cartItems = await prisma.carrito.findMany({
      where: { id_usuario: userId },
      include: {
        producto: {
          include: {
            proveedor: {
              select: {
                id_proveedor: true,
                nombre_negocio: true,
                radio_entrega_km: true,
                cobra_envio: true,
                envio_gratis_desde: true,
              },
            },
            categoria: {
              select: {
                id_categoria: true,
                nombre: true,
              },
            },
            descuentos_cantidad: {
              where: { activo: true },
              orderBy: { cantidad_minima: 'asc' },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Calculate totals and applicable discounts
    const processedItems = cartItems.map((item) => {
      const basePrice = Number(item.producto.precio_unitario);
      let finalPrice = Number(item.precio_unitario) || basePrice;
      let applicableDiscount = null;

      // Find best applicable discount
      const discounts = item.producto.descuentos_cantidad;
      for (const discount of discounts) {
        if (item.cantidad >= discount.cantidad_minima) {
          if (discount.precio_descuento) {
            finalPrice = Math.min(finalPrice, Number(discount.precio_descuento));
            applicableDiscount = discount;
          } else if (discount.descuento_porcentaje) {
            const discountedPrice = basePrice * (1 - Number(discount.descuento_porcentaje) / 100);
            if (discountedPrice < finalPrice) {
              finalPrice = discountedPrice;
              applicableDiscount = discount;
            }
          }
        }
      }

      return {
        ...item,
        precio_final: finalPrice,
        subtotal: finalPrice * item.cantidad,
        descuento_aplicado: applicableDiscount,
        ahorro: applicableDiscount ? (basePrice - finalPrice) * item.cantidad : 0,
      };
    });

    // Calculate cart totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalAhorro = processedItems.reduce((sum, item) => sum + item.ahorro, 0);

    res.json({
      success: true,
      data: {
        items: processedItems,
        resumen: {
          cantidad_items: processedItems.length,
          cantidad_productos: processedItems.reduce((sum, item) => sum + item.cantidad, 0),
          subtotal,
          total_ahorro: totalAhorro,
          total: subtotal,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// POST /carrito/:userId - Add item to cart
carritoRouter.post('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }

    const { id_producto, cantidad, precio_unitario }: AddToCartRequest = req.body;

    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto inválidos',
      });
    }

    // Verify product exists and is available
    const product = await prisma.productos.findUnique({
      where: { id_producto },
      include: {
        descuentos_cantidad: {
          where: { activo: true },
          orderBy: { cantidad_minima: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    if (!product.disponible) {
      return res.status(400).json({
        success: false,
        message: 'Producto no disponible',
      });
    }

    // Calculate final price with discounts
    let finalPrice = precio_unitario || Number(product.precio_unitario);
    const basePrice = Number(product.precio_unitario);

    // Apply quantity discounts if applicable
    for (const discount of product.descuentos_cantidad) {
      if (cantidad >= discount.cantidad_minima) {
        if (discount.precio_descuento) {
          finalPrice = Math.min(finalPrice, Number(discount.precio_descuento));
        } else if (discount.descuento_porcentaje) {
          const discountedPrice = basePrice * (1 - Number(discount.descuento_porcentaje) / 100);
          finalPrice = Math.min(finalPrice, discountedPrice);
        }
      }
    }

    // Check if item already exists in cart
    const existingItem = await prisma.carrito.findFirst({
      where: {
        id_usuario: userId,
        id_producto,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update existing item
      cartItem = await prisma.carrito.update({
        where: { id_carrito: existingItem.id_carrito },
        data: {
          cantidad: existingItem.cantidad + cantidad,
          precio_unitario: finalPrice,
          updated_at: new Date(),
        },
        include: {
          producto: {
            include: {
              proveedor: {
                select: {
                  nombre_negocio: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.carrito.create({
        data: {
          id_usuario: userId,
          id_producto,
          cantidad,
          precio_unitario: finalPrice,
        },
        include: {
          producto: {
            include: {
              proveedor: {
                select: {
                  nombre_negocio: true,
                },
              },
            },
          },
        },
      });
    }

    logger.log(`Added ${cantidad} x ${product.nombre_producto} to cart for user ${userId}`);

    res.status(201).json({
      success: true,
      data: cartItem,
      message: 'Producto agregado al carrito',
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// PUT /carrito/:userId/:itemId - Update cart item
carritoRouter.put('/:userId/:itemId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId);

    if (isNaN(userId) || isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'IDs inválidos',
      });
    }

    const { cantidad, precio_unitario }: UpdateCartItemRequest = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad inválida',
      });
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.carrito.findFirst({
      where: {
        id_carrito: itemId,
        id_usuario: userId,
      },
      include: {
        producto: {
          include: {
            descuentos_cantidad: {
              where: { activo: true },
              orderBy: { cantidad_minima: 'asc' },
            },
          },
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item del carrito no encontrado',
      });
    }

    // Recalculate price with new quantity
    let finalPrice = precio_unitario || Number(cartItem.producto.precio_unitario);
    const basePrice = Number(cartItem.producto.precio_unitario);

    // Apply quantity discounts
    for (const discount of cartItem.producto.descuentos_cantidad) {
      if (cantidad >= discount.cantidad_minima) {
        if (discount.precio_descuento) {
          finalPrice = Math.min(finalPrice, Number(discount.precio_descuento));
        } else if (discount.descuento_porcentaje) {
          const discountedPrice = basePrice * (1 - Number(discount.descuento_porcentaje) / 100);
          finalPrice = Math.min(finalPrice, discountedPrice);
        }
      }
    }

    const updatedItem = await prisma.carrito.update({
      where: { id_carrito: itemId },
      data: {
        cantidad,
        precio_unitario: finalPrice,
        updated_at: new Date(),
      },
      include: {
        producto: {
          include: {
            proveedor: {
              select: {
                nombre_negocio: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item del carrito actualizado',
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// DELETE /carrito/:userId/:itemId - Remove item from cart
carritoRouter.delete('/:userId/:itemId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId);

    if (isNaN(userId) || isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'IDs inválidos',
      });
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.carrito.findFirst({
      where: {
        id_carrito: itemId,
        id_usuario: userId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item del carrito no encontrado',
      });
    }

    await prisma.carrito.delete({
      where: { id_carrito: itemId },
    });

    logger.log(`Removed cart item ${itemId} for user ${userId}`);

    res.json({
      success: true,
      message: 'Item eliminado del carrito',
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// DELETE /carrito/:userId - Clear entire cart
carritoRouter.delete('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }

    const result = await prisma.carrito.deleteMany({
      where: { id_usuario: userId },
    });

    logger.log(`Cleared cart for user ${userId}, removed ${result.count} items`);

    res.json({
      success: true,
      message: `Carrito vaciado - ${result.count} items eliminados`,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

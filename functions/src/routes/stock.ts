import { EstadoReserva, MetodoRegistro, PrismaClient, TipoAlerta, TipoMovimiento } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const stockRouter = Router();

// ============================================
// STOCK MOVEMENTS ENDPOINTS
// ============================================

// GET /stock/movements - Get stock movements with filtering
stockRouter.get('/movements', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const id_producto = req.query.id_producto ? parseInt(req.query.id_producto as string) : undefined;
    const tipo_movimiento = req.query.tipo_movimiento as TipoMovimiento | undefined;
    const metodo_registro = req.query.metodo_registro as MetodoRegistro | undefined;
    const fecha_desde = req.query.fecha_desde as string | undefined;
    const fecha_hasta = req.query.fecha_hasta as string | undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (id_producto) where.id_producto = id_producto;
    if (tipo_movimiento) where.tipo_movimiento = tipo_movimiento;
    if (metodo_registro) where.metodo_registro = metodo_registro;
    if (fecha_desde || fecha_hasta) {
      where.fecha_movimiento = {};
      if (fecha_desde) where.fecha_movimiento.gte = new Date(fecha_desde);
      if (fecha_hasta) where.fecha_movimiento.lte = new Date(fecha_hasta);
    }

    const [movements, total] = await Promise.all([
      prisma.movimientos_stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_movimiento: 'desc' },
        include: {
          producto: {
            select: {
              id_producto: true,
              nombre_producto: true,
              imagen_url: true,
            },
          },
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
              email: true,
            },
          },
        },
      }),
      prisma.movimientos_stock.count({ where }),
    ]);

    res.json({
      success: true,
      data: movements,
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

// POST /stock/movements - Register a stock movement
stockRouter.post('/movements', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      id_producto,
      tipo_movimiento,
      cantidad,
      metodo_registro = MetodoRegistro.MANUAL,
      id_usuario_registro,
      observaciones,
      costo_unitario,
      numero_factura,
    } = req.body;

    // Validate required fields
    if (!id_producto || !tipo_movimiento || !cantidad) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: id_producto, tipo_movimiento, cantidad',
      });
      return;
    }

    // Get current product stock
    const producto = await prisma.productos.findUnique({
      where: { id_producto },
      select: { stock_actual: true, stock_minimo: true, nombre_producto: true },
    });

    if (!producto) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    const stock_previo = producto.stock_actual;
    let stock_resultante = stock_previo;

    // Calculate new stock based on movement type
    const tiposEntrada = [
      TipoMovimiento.ENTRADA_COMPRA,
      TipoMovimiento.ENTRADA_DEVOLUCION,
      TipoMovimiento.ENTRADA_AJUSTE,
      TipoMovimiento.LIBERACION_RESERVA,
      TipoMovimiento.ENTRADA_REABASTECIMIENTO,
    ];
    const tiposSalida = [
      TipoMovimiento.SALIDA_VENTA,
      TipoMovimiento.SALIDA_DEVOLUCION,
      TipoMovimiento.SALIDA_MERMA,
      TipoMovimiento.SALIDA_AJUSTE,
      TipoMovimiento.RESERVA,
    ];

    if (tiposEntrada.includes(tipo_movimiento)) {
      stock_resultante = stock_previo + cantidad;
    } else if (tiposSalida.includes(tipo_movimiento)) {
      stock_resultante = stock_previo - cantidad;
      if (stock_resultante < 0) {
        res.status(400).json({
          success: false,
          error: 'Insufficient stock for this operation',
        });
        return;
      }
    }

    const costo_total = costo_unitario ? costo_unitario * cantidad : undefined;

    // Create movement and update product stock in a transaction
    const [movement, updatedProduct] = await prisma.$transaction([
      prisma.movimientos_stock.create({
        data: {
          id_producto,
          tipo_movimiento,
          cantidad,
          stock_previo,
          stock_resultante,
          metodo_registro,
          id_usuario_registro,
          observaciones,
          costo_unitario,
          costo_total,
          numero_factura,
        },
        include: {
          producto: {
            select: {
              id_producto: true,
              nombre_producto: true,
            },
          },
        },
      }),
      prisma.productos.update({
        where: { id_producto },
        data: {
          stock_actual: stock_resultante,
          ultimo_reabastecimiento:
            tipo_movimiento === TipoMovimiento.ENTRADA_REABASTECIMIENTO ? new Date() : undefined,
        },
      }),
    ]);

    // Check if we need to create a stock alert
    if (updatedProduct.alerta_stock_bajo && stock_resultante <= producto.stock_minimo) {
      const existingAlert = await prisma.alertas_stock.findFirst({
        where: {
          id_producto,
          resuelta: false,
          tipo_alerta: {
            in: [TipoAlerta.STOCK_BAJO, TipoAlerta.STOCK_CRITICO, TipoAlerta.STOCK_AGOTADO],
          },
        },
      });

      if (!existingAlert) {
        let tipo_alerta: TipoAlerta = TipoAlerta.STOCK_BAJO;
        let mensaje = `Stock bajo para ${producto.nombre_producto}`;

        if (stock_resultante === 0) {
          tipo_alerta = TipoAlerta.STOCK_AGOTADO;
          mensaje = `Stock agotado para ${producto.nombre_producto}`;
        } else if (stock_resultante < producto.stock_minimo / 2) {
          tipo_alerta = TipoAlerta.STOCK_CRITICO;
          mensaje = `Stock crítico para ${producto.nombre_producto}`;
        }

        await prisma.alertas_stock.create({
          data: {
            id_producto,
            tipo_alerta,
            stock_actual: stock_resultante,
            stock_minimo: producto.stock_minimo,
            mensaje,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: movement,
      stock_updated: {
        stock_previo,
        stock_actual: stock_resultante,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// STOCK ALERTS ENDPOINTS
// ============================================

// GET /stock/alerts - Get stock alerts
stockRouter.get('/alerts', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const id_producto = req.query.id_producto ? parseInt(req.query.id_producto as string) : undefined;
    const tipo_alerta = req.query.tipo_alerta as TipoAlerta | undefined;
    const resuelta = req.query.resuelta === 'true' ? true : req.query.resuelta === 'false' ? false : undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (id_producto) where.id_producto = id_producto;
    if (tipo_alerta) where.tipo_alerta = tipo_alerta;
    if (resuelta !== undefined) where.resuelta = resuelta;

    const [alerts, total] = await Promise.all([
      prisma.alertas_stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_alerta: 'desc' },
        include: {
          producto: {
            select: {
              id_producto: true,
              nombre_producto: true,
              stock_actual: true,
              stock_minimo: true,
              imagen_url: true,
            },
          },
          usuario_resolvio: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
        },
      }),
      prisma.alertas_stock.count({ where }),
    ]);

    res.json({
      success: true,
      data: alerts,
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

// PATCH /stock/alerts/:id/resolve - Resolve a stock alert
stockRouter.patch('/alerts/:id/resolve', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_alerta = parseInt(req.params.id);
    const { id_usuario_resolvio, notas_resolucion } = req.body;

    const alert = await prisma.alertas_stock.update({
      where: { id_alerta },
      data: {
        resuelta: true,
        fecha_resolucion: new Date(),
        id_usuario_resolvio,
        notas_resolucion,
      },
      include: {
        producto: {
          select: {
            nombre_producto: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// STOCK RESERVATIONS ENDPOINTS
// ============================================

// GET /stock/reservations - Get stock reservations
stockRouter.get('/reservations', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const id_producto = req.query.id_producto ? parseInt(req.query.id_producto as string) : undefined;
    const estado = req.query.estado as EstadoReserva | undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (id_producto) where.id_producto = id_producto;
    if (estado) where.estado = estado;

    const [reservations, total] = await Promise.all([
      prisma.reservas_stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_reserva: 'desc' },
        include: {
          producto: {
            select: {
              id_producto: true,
              nombre_producto: true,
              stock_actual: true,
            },
          },
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
        },
      }),
      prisma.reservas_stock.count({ where }),
    ]);

    res.json({
      success: true,
      data: reservations,
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

// POST /stock/reservations - Create a stock reservation
stockRouter.post('/reservations', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      id_producto,
      tipo_reserva,
      cantidad_reservada,
      id_usuario,
      id_pedido,
      id_campana,
      fecha_expiracion,
      observaciones,
    } = req.body;

    if (!id_producto || !tipo_reserva || !cantidad_reservada) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: id_producto, tipo_reserva, cantidad_reservada',
      });
      return;
    }

    // Check available stock
    const producto = await prisma.productos.findUnique({
      where: { id_producto },
      select: { stock_actual: true, nombre_producto: true },
    });

    if (!producto) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    // Calculate reserved stock
    const reservedStock = await prisma.reservas_stock.aggregate({
      where: {
        id_producto,
        estado: EstadoReserva.ACTIVA,
      },
      _sum: {
        cantidad_reservada: true,
      },
    });

    const totalReserved = reservedStock._sum.cantidad_reservada || 0;
    const availableStock = producto.stock_actual - totalReserved;

    if (availableStock < cantidad_reservada) {
      res.status(400).json({
        success: false,
        error: 'Insufficient available stock for reservation',
        data: {
          stock_actual: producto.stock_actual,
          already_reserved: totalReserved,
          available: availableStock,
          requested: cantidad_reservada,
        },
      });
      return;
    }

    const reservation = await prisma.reservas_stock.create({
      data: {
        id_producto,
        tipo_reserva,
        cantidad_reservada,
        id_usuario,
        id_pedido,
        id_campana,
        fecha_expiracion,
        observaciones,
      },
      include: {
        producto: {
          select: {
            id_producto: true,
            nombre_producto: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /stock/reservations/:id/release - Release a stock reservation
stockRouter.patch('/reservations/:id/release', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_reserva = parseInt(req.params.id);
    const { estado = EstadoReserva.CANCELADA } = req.body;

    const reservation = await prisma.reservas_stock.update({
      where: { id_reserva },
      data: {
        estado,
        fecha_liberacion: new Date(),
      },
      include: {
        producto: true,
      },
    });

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// NOTE: WhatsApp bot integration is handled by an external API
// This API only provides stock management endpoints that the external bot calls
// ============================================

// ============================================
// STOCK ANALYTICS ENDPOINTS
// ============================================

// GET /stock/analytics/product/:id - Get stock analytics for a product
stockRouter.get('/analytics/product/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_producto = parseInt(req.params.id);

    const product = await prisma.productos.findUnique({
      where: { id_producto },
      select: {
        id_producto: true,
        nombre_producto: true,
        stock_actual: true,
        stock_minimo: true,
        stock_maximo: true,
        ultimo_reabastecimiento: true,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    // Get movement statistics
    const movementStats = await prisma.movimientos_stock.groupBy({
      by: ['tipo_movimiento'],
      where: { id_producto },
      _sum: {
        cantidad: true,
      },
      _count: {
        id_movimiento: true,
      },
    });

    // Get recent movements
    const recentMovements = await prisma.movimientos_stock.findMany({
      where: { id_producto },
      take: 10,
      orderBy: { fecha_movimiento: 'desc' },
    });

    // Get active reservations
    const activeReservations = await prisma.reservas_stock.aggregate({
      where: {
        id_producto,
        estado: EstadoReserva.ACTIVA,
      },
      _sum: {
        cantidad_reservada: true,
      },
      _count: {
        id_reserva: true,
      },
    });

    // Get unresolved alerts
    const unresolvedAlerts = await prisma.alertas_stock.count({
      where: {
        id_producto,
        resuelta: false,
      },
    });

    res.json({
      success: true,
      data: {
        product,
        movement_stats: movementStats,
        recent_movements: recentMovements,
        active_reservations: {
          count: activeReservations._count.id_reserva,
          total_quantity: activeReservations._sum.cantidad_reservada || 0,
          available_stock: product.stock_actual - (activeReservations._sum.cantidad_reservada || 0),
        },
        unresolved_alerts: unresolvedAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { stockRouter };
export default stockRouter;

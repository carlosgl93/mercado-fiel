import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Router } from 'express';
import { AuthenticatedRequest, optionalAuthMiddleware } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Interfaces for request/response types
export interface CreateCompraColectivaRequest {
  nombre: string;
  descripcion?: string;
  id_producto: number;
  cantidad_objetivo: number;
  precio_objetivo: number;
  fecha_fin?: string;
  cantidad_inicial: number; // Amount creator wants to purchase (must be >= 20% of total)
}

export interface UpdateCompraColectivaRequest {
  nombre?: string;
  descripcion?: string;
  fecha_fin?: string;
  estado?: 'abierta' | 'cerrada' | 'completada' | 'cancelada';
}

export interface JoinCompraColectivaRequest {
  cantidad: number; // Amount user wants to purchase
}

// Helper function to calculate business rules
const calculateMinimumPurchase = (cantidadObjetivo: number, cantidadActual: number): number => {
  const remaining = cantidadObjetivo - cantidadActual;
  return Math.ceil(remaining * 0.2); // 20% of remaining amount
};

const validateCreatorMinimum = (cantidadObjetivo: number, cantidadInicial: number): boolean => {
  const minimumRequired = Math.ceil(cantidadObjetivo * 0.2); // 20% of total
  return cantidadInicial >= minimumRequired;
};

// GET /compras-colectivas - List all active campaigns
router.get('/', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 10, estado = 'abierta' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const campaigns = await prisma.compras_colectivas.findMany({
      where: {
        estado: estado as string,
      },
      include: {
        producto: {
          include: {
            proveedor: {
              select: {
                id_proveedor: true,
                nombre_negocio: true,
              },
            },
            categoria: {
              select: {
                id_categoria: true,
                nombre: true,
              },
            },
          },
        },
        proveedor: {
          select: {
            id_proveedor: true,
            nombre_negocio: true,
          },
        },
        progreso: true,
        participantes: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
              },
            },
          },
        },
        escalas_precios: {
          orderBy: {
            cantidad_minima: 'asc',
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    });

    // Get total count for pagination
    const total = await prisma.compras_colectivas.count({
      where: {
        estado: estado as string,
      },
    });

    return res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las campañas',
    });
  }
});

// GET /compras-colectivas/:id - Get specific campaign details
router.get('/:id', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.compras_colectivas.findUnique({
      where: {
        id_campana: parseInt(id),
      },
      include: {
        producto: {
          include: {
            proveedor: {
              select: {
                id_proveedor: true,
                nombre_negocio: true,
                email: true,
              },
            },
            categoria: {
              select: {
                id_categoria: true,
                nombre: true,
              },
            },
          },
        },
        proveedor: {
          select: {
            id_proveedor: true,
            nombre_negocio: true,
            email: true,
          },
        },
        progreso: true,
        participantes: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
              },
            },
          },
          orderBy: {
            fecha_aporte: 'asc',
          },
        },
        escalas_precios: {
          orderBy: {
            cantidad_minima: 'asc',
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
    }

    // Calculate current minimum purchase for new participants
    const currentProgress = campaign.progreso;
    const minimumPurchase = currentProgress 
      ? calculateMinimumPurchase(campaign.cantidad_objetivo, currentProgress.cantidad_actual)
      : calculateMinimumPurchase(campaign.cantidad_objetivo, 0);

    return res.json({
      success: true,
      data: {
        ...campaign,
        minimum_purchase: minimumPurchase,
      },
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la campaña',
    });
  }
});

// POST /compras-colectivas - Create new campaign
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      nombre,
      descripcion,
      id_producto,
      cantidad_objetivo,
      precio_objetivo,
      fecha_fin,
      cantidad_inicial,
    }: CreateCompraColectivaRequest = req.body;

    // Get user ID from authenticated request
    const userId = req.user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Validate required fields
    if (!nombre || !id_producto || !cantidad_objetivo || !precio_objetivo || !cantidad_inicial) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos requeridos deben ser proporcionados',
      });
    }

    // Validate creator minimum (20% of total)
    if (!validateCreatorMinimum(cantidad_objetivo, cantidad_inicial)) {
      const minimumRequired = Math.ceil(cantidad_objetivo * 0.2);
      return res.status(400).json({
        success: false,
        message: `El creador debe comprometerse a comprar al menos el 20% del objetivo (${minimumRequired} unidades)`,
      });
    }

    // Check if product exists and is eligible for collective purchases
    const product = await prisma.productos.findUnique({
      where: { id_producto },
      include: {
        proveedor: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    if (!product.elegible_compra_colectiva) {
      return res.status(400).json({
        success: false,
        message: 'Este producto no es elegible para compras colectivas',
      });
    }

    // Check if user is the provider of the product
    const userProvider = await prisma.proveedores.findFirst({
      where: { id_usuario: userId },
    });

    if (!userProvider || userProvider.id_proveedor !== product.id_proveedor) {
      return res.status(403).json({
        success: false,
        message: 'Solo el proveedor del producto puede crear campañas para sus productos',
      });
    }

    // Create campaign with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create campaign
      const campaign = await tx.compras_colectivas.create({
        data: {
          nombre,
          descripcion,
          id_proveedor: userProvider.id_proveedor,
          id_producto,
          precio_objetivo,
          cantidad_objetivo,
          min_participantes: 1,
          max_participantes: 5, // Business rule: max 5 participants
          cantidad_min_usuario: calculateMinimumPurchase(cantidad_objetivo, cantidad_inicial),
          fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
          estado: 'abierta',
        },
      });

      // Add creator as first participant
      await tx.participanteColectivo.create({
        data: {
          id_campana: campaign.id_campana,
          id_usuario: userId,
          cantidad: cantidad_inicial,
          monto_aportado: new Decimal(cantidad_inicial).mul(precio_objetivo),
          estado: 'activo',
        },
      });

      // Create progress tracking
      await tx.progreso_campana.create({
        data: {
          id_campana: campaign.id_campana,
          participantes_actuales: 1,
          cantidad_actual: cantidad_inicial,
          monto_recaudado: new Decimal(cantidad_inicial).mul(precio_objetivo),
          porcentaje_completado: new Decimal(cantidad_inicial).div(cantidad_objetivo).mul(100),
          precio_actual: new Decimal(precio_objetivo),
        },
      });

      return campaign;
    });

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Campaña creada exitosamente',
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la campaña',
    });
  }
});

// POST /compras-colectivas/:id/join - Join a campaign
router.post('/:id/join', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { cantidad }: JoinCompraColectivaRequest = req.body;

    // Get user ID from authenticated request
    const userId = req.user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Validate cantidad
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser mayor a 0',
      });
    }

    // Get campaign with current progress
    const campaign = await prisma.compras_colectivas.findUnique({
      where: { id_campana: parseInt(id) },
      include: {
        progreso: true,
        participantes: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
    }

    if (campaign.estado !== 'abierta') {
      return res.status(400).json({
        success: false,
        message: 'La campaña no está abierta para nuevos participantes',
      });
    }

    // Check if user is already a participant
    const existingParticipant = campaign.participantes.find(p => p.id_usuario === userId);
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Ya eres participante de esta campaña',
      });
    }

    // Check maximum participants limit
    if (campaign.participantes.length >= 5) {
      return res.status(400).json({
        success: false,
        message: 'La campaña ya alcanzó el máximo de participantes (5)',
      });
    }

    // Validate minimum purchase requirement
    const currentProgress = campaign.progreso;
    const minimumRequired = currentProgress 
      ? calculateMinimumPurchase(campaign.cantidad_objetivo, currentProgress.cantidad_actual)
      : calculateMinimumPurchase(campaign.cantidad_objetivo, 0);

    if (cantidad < minimumRequired) {
      return res.status(400).json({
        success: false,
        message: `La cantidad mínima requerida es ${minimumRequired} unidades`,
      });
    }

    // Check if total wouldn't exceed goal
    const currentTotal = currentProgress?.cantidad_actual || 0;
    if (currentTotal + cantidad > campaign.cantidad_objetivo) {
      const remaining = campaign.cantidad_objetivo - currentTotal;
      return res.status(400).json({
        success: false,
        message: `La cantidad máxima disponible es ${remaining} unidades`,
      });
    }

    // Join campaign with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Add participant
      const participant = await tx.participanteColectivo.create({
        data: {
          id_campana: parseInt(id),
          id_usuario: userId,
          cantidad,
          monto_aportado: new Decimal(cantidad).mul(campaign.precio_objetivo),
          estado: 'activo',
        },
      });

      // Update progress
      const newTotal = currentTotal + cantidad;
      const newParticipants = campaign.participantes.length + 1;
      const newPercentage = (newTotal / campaign.cantidad_objetivo) * 100;

      await tx.progreso_campana.update({
        where: { id_campana: parseInt(id) },
        data: {
          participantes_actuales: newParticipants,
          cantidad_actual: newTotal,
          monto_recaudado: currentProgress 
            ? currentProgress.monto_recaudado.add(new Decimal(cantidad).mul(campaign.precio_objetivo))
            : new Decimal(cantidad).mul(campaign.precio_objetivo),
          porcentaje_completado: new Decimal(newPercentage),
        },
      });

      // Check if campaign is completed
      if (newTotal >= campaign.cantidad_objetivo) {
        await tx.compras_colectivas.update({
          where: { id_campana: parseInt(id) },
          data: { estado: 'completada' },
        });
      }

      return participant;
    });

    return res.json({
      success: true,
      data: result,
      message: 'Te has unido a la campaña exitosamente',
    });
  } catch (error) {
    console.error('Error joining campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al unirse a la campaña',
    });
  }
});

// PUT /compras-colectivas/:id - Update campaign (only by creator/provider)
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateCompraColectivaRequest = req.body;

    const userId = (req as any).user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Get campaign and check ownership
    const campaign = await prisma.compras_colectivas.findUnique({
      where: { id_campana: parseInt(id) },
      include: {
        proveedor: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
    }

    if (campaign.proveedor.usuario.id_usuario !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el creador puede modificar la campaña',
      });
    }

    // Update campaign
    const updatedCampaign = await prisma.compras_colectivas.update({
      where: { id_campana: parseInt(id) },
      data: {
        ...updates,
        fecha_fin: updates.fecha_fin ? new Date(updates.fecha_fin) : undefined,
        updated_at: new Date(),
      },
    });

    return res.json({
      success: true,
      data: updatedCampaign,
      message: 'Campaña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la campaña',
    });
  }
});

// DELETE /compras-colectivas/:id - Cancel campaign (only by creator/provider)
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Get campaign and check ownership
    const campaign = await prisma.compras_colectivas.findUnique({
      where: { id_campana: parseInt(id) },
      include: {
        proveedor: {
          include: {
            usuario: true,
          },
        },
        participantes: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
    }

    if (campaign.proveedor.usuario.id_usuario !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el creador puede cancelar la campaña',
      });
    }

    if (campaign.participantes.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una campaña con participantes',
      });
    }

    // Cancel campaign (soft delete by changing status)
    const cancelledCampaign = await prisma.compras_colectivas.update({
      where: { id_campana: parseInt(id) },
      data: {
        estado: 'cancelada',
        updated_at: new Date(),
      },
    });

    return res.json({
      success: true,
      data: cancelledCampaign,
      message: 'Campaña cancelada exitosamente',
    });
  } catch (error) {
    console.error('Error cancelling campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al cancelar la campaña',
    });
  }
});

// DELETE /compras-colectivas/:id/leave - Leave a campaign
router.delete('/:id/leave', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Get campaign and participant
    const campaign = await prisma.compras_colectivas.findUnique({
      where: { id_campana: parseInt(id) },
      include: {
        progreso: true,
        participantes: {
          where: { id_usuario: userId },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada',
      });
    }

    const participant = campaign.participantes[0];
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'No eres participante de esta campaña',
      });
    }

    if (campaign.estado !== 'abierta') {
      return res.status(400).json({
        success: false,
        message: 'No se puede salir de una campaña que no está abierta',
      });
    }

    // Leave campaign with transaction
    await prisma.$transaction(async (tx) => {
      // Remove participant
      await tx.participanteColectivo.delete({
        where: {
          id_participante: participant.id_participante,
        },
      });

      // Update progress
      const currentProgress = campaign.progreso!;
      const newTotal = currentProgress.cantidad_actual - participant.cantidad;
      const newMonto = currentProgress.monto_recaudado.sub(participant.monto_aportado);
      const newParticipants = currentProgress.participantes_actuales - 1;
      const newPercentage = newTotal > 0 ? (newTotal / campaign.cantidad_objetivo) * 100 : 0;

      await tx.progreso_campana.update({
        where: { id_campana: parseInt(id) },
        data: {
          participantes_actuales: newParticipants,
          cantidad_actual: newTotal,
          monto_recaudado: newMonto,
          porcentaje_completado: new Decimal(newPercentage),
        },
      });

      // If no participants left, cancel campaign
      if (newParticipants === 0) {
        await tx.compras_colectivas.update({
          where: { id_campana: parseInt(id) },
          data: { estado: 'cancelada' },
        });
      }
    });

    return res.json({
      success: true,
      message: 'Has salido de la campaña exitosamente',
    });
  } catch (error) {
    console.error('Error leaving campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al salir de la campaña',
    });
  }
});

export { router as comprasColectivasRouter };

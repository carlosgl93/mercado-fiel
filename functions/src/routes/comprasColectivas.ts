import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Router } from 'express';
import { AuthenticatedRequest, authMiddleware, optionalAuthMiddleware } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Interfaces for request/response types
export interface CreateCompraColectivaRequest {
  nombre: string;
  descripcion?: string;
  id_producto: number;
  id_descuento_aplicado: number; // ID of the selected quantity discount
  fecha_fin?: string;
  cantidad_inicial: number; // Amount creator wants to purchase (must be >= 20% of discount minimum)
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

const validateCreatorMinimum = (cantidadMinima: number, cantidadInicial: number): boolean => {
  const minimumRequired = Math.ceil(cantidadMinima * 0.2); // 20% of discount minimum quantity
  return cantidadInicial >= minimumRequired;
};

// Helper function to check if user is the campaign creator
// The creator is identified as the first participant (earliest fecha_aporte)
const isCampaignCreator = async (campaignId: number, userId: number): Promise<boolean> => {
  const firstParticipant = await prisma.participanteColectivo.findFirst({
    where: { id_campana: campaignId },
    orderBy: { fecha_aporte: 'asc' },
  });

  return firstParticipant?.id_usuario === userId;
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

// GET /compras-colectivas/product/:productId/discounts - Get available quantity discounts for a product
router.get(
  '/product/:productId/discounts',
  optionalAuthMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { productId } = req.params;
      const productIdNum = parseInt(productId, 10);

      if (isNaN(productIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'ID de producto inválido',
        });
      }

      // Get product with available quantity discounts
      const product = await prisma.productos.findUnique({
        where: { id_producto: productIdNum },
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

      if (!product.elegible_compra_colectiva) {
        return res.status(400).json({
          success: false,
          message: 'Este producto no es elegible para compras colectivas',
        });
      }

      // Calculate prices for each discount
      const basePrice = product.precio_unitario;
      const discountsWithPrices = product.descuentos_cantidad.map((discount) => ({
        ...discount,
        precio_descuento:
          discount.precio_descuento ||
          basePrice.mul(new Decimal(1).sub(discount.descuento_porcentaje.div(100))),
        ahorro_por_unidad: basePrice.sub(
          discount.precio_descuento ||
            basePrice.mul(new Decimal(1).sub(discount.descuento_porcentaje.div(100))),
        ),
        minimo_creador: Math.ceil(discount.cantidad_minima * 0.2), // 20% minimum for creator
      }));

      return res.json({
        success: true,
        data: {
          producto: {
            id_producto: product.id_producto,
            nombre_producto: product.nombre_producto,
            precio_unitario: product.precio_unitario,
            elegible_compra_colectiva: product.elegible_compra_colectiva,
          },
          descuentos_disponibles: discountsWithPrices,
        },
      });
    } catch (error) {
      console.error('Error fetching product discounts:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los descuentos del producto',
      });
    }
  },
);

// POST /compras-colectivas - Create new campaign
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      nombre,
      descripcion,
      id_producto,
      id_descuento_aplicado,
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
    if (!nombre || !id_producto || !id_descuento_aplicado || !cantidad_inicial) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos requeridos deben ser proporcionados',
      });
    }

    // Get the selected quantity discount
    const selectedDiscount = await prisma.descuentos_cantidad.findUnique({
      where: { id_descuento: id_descuento_aplicado },
      include: {
        producto: {
          include: {
            proveedor: true,
          },
        },
      },
    });

    if (!selectedDiscount || !selectedDiscount.activo) {
      return res.status(404).json({
        success: false,
        message: 'Descuento por cantidad no encontrado o inactivo',
      });
    }

    // Verify the discount belongs to the specified product
    if (selectedDiscount.id_producto !== id_producto) {
      return res.status(400).json({
        success: false,
        message: 'El descuento seleccionado no pertenece al producto especificado',
      });
    }

    const product = selectedDiscount.producto;

    if (!product.elegible_compra_colectiva) {
      return res.status(400).json({
        success: false,
        message: 'Este producto no es elegible para compras colectivas',
      });
    }

    // Allow any user to create campaigns for eligible products
    // We'll use the product's original provider for the campaign's proveedor field
    // But track the actual creator through the first participant

    // ⚠️ CRITICAL BUSINESS RULE: Suppliers cannot create campaigns for their own products
    // Check if the authenticated user is the supplier of this product
    const userProvider = await prisma.proveedores.findFirst({
      where: { id_usuario: userId },
    });

    if (userProvider && userProvider.id_proveedor === product.id_proveedor) {
      return res.status(403).json({
        success: false,
        message: 'Los proveedores no pueden crear campañas colectivas para sus propios productos',
      });
    }

    // Validate creator minimum (20% of discount minimum quantity)
    if (!validateCreatorMinimum(selectedDiscount.cantidad_minima, cantidad_inicial)) {
      const minimumRequired = Math.ceil(selectedDiscount.cantidad_minima * 0.2);
      return res.status(400).json({
        success: false,
        message: `El creador debe comprometerse a comprar al menos el 20% de la cantidad mínima del descuento (${minimumRequired} unidades)`,
      });
    }

    // Calculate campaign pricing based on selected discount
    const basePrice = product.precio_unitario;
    const discountPercentage = selectedDiscount.descuento_porcentaje;
    const discountedPrice =
      selectedDiscount.precio_descuento ||
      basePrice.mul(new Decimal(1).sub(discountPercentage.div(100)));

    // Create campaign with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create campaign
      const campaign = await tx.compras_colectivas.create({
        data: {
          nombre,
          descripcion,
          id_proveedor: product.id_proveedor, // Use original product's provider
          id_producto,
          id_descuento_aplicado, // 🆕 Link to selected discount
          precio_objetivo: discountedPrice,
          cantidad_objetivo: selectedDiscount.cantidad_minima,
          min_participantes: 1,
          max_participantes: 5, // Business rule: max 5 participants
          cantidad_min_usuario: calculateMinimumPurchase(
            selectedDiscount.cantidad_minima,
            cantidad_inicial,
          ),
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
          monto_aportado: new Decimal(cantidad_inicial).mul(discountedPrice),
          estado: 'activo',
        },
      });

      // Create progress tracking
      await tx.progreso_campana.create({
        data: {
          id_campana: campaign.id_campana,
          participantes_actuales: 1,
          cantidad_actual: cantidad_inicial,
          monto_recaudado: new Decimal(cantidad_inicial).mul(discountedPrice),
          porcentaje_completado: new Decimal(cantidad_inicial)
            .div(selectedDiscount.cantidad_minima)
            .mul(100),
          precio_actual: discountedPrice,
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
router.post('/:id/join', authMiddleware, async (req: AuthenticatedRequest, res) => {
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
    const existingParticipant = campaign.participantes.find((p) => p.id_usuario === userId);
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
            ? currentProgress.monto_recaudado.add(
                new Decimal(cantidad).mul(campaign.precio_objetivo),
              )
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
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
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
        producto: true, // Include product for supplier validation
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

    // Check if user is the campaign creator (first participant)
    const isCreator = await isCampaignCreator(parseInt(id), userId);
    if (!isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Solo el creador puede modificar la campaña',
      });
    }

    // ⚠️ BUSINESS RULE: Verify user is not the product supplier (anti-exploit check)
    const userProvider = await prisma.proveedores.findFirst({
      where: { id_usuario: userId },
    });

    if (userProvider && userProvider.id_proveedor === campaign.producto.id_proveedor) {
      return res.status(403).json({
        success: false,
        message: 'Los proveedores no pueden modificar campañas para sus propios productos',
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
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
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
        producto: true, // Include product for supplier validation
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

    // Check if user is the campaign creator (first participant)
    const isCreator = await isCampaignCreator(parseInt(id), userId);
    if (!isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Solo el creador puede cancelar la campaña',
      });
    }

    // ⚠️ BUSINESS RULE: Verify user is not the product supplier (anti-exploit check)
    const userProvider = await prisma.proveedores.findFirst({
      where: { id_usuario: userId },
    });

    if (userProvider && userProvider.id_proveedor === campaign.producto.id_proveedor) {
      return res.status(403).json({
        success: false,
        message: 'Los proveedores no pueden cancelar campañas para sus propios productos',
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

// GET /compras-colectivas/my-participated - Get campaigns where user is a participant (not creator)
router.get('/my-participated', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const userId = req.user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Find campaigns where user is a participant but not the creator
    const participatedCampaigns = await prisma.compras_colectivas.findMany({
      where: {
        participantes: {
          some: {
            id_usuario: userId,
          },
        },
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
          orderBy: {
            fecha_aporte: 'asc',
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    });

    // Filter to only campaigns where user is NOT the creator (not first participant)
    const userParticipatedCampaigns = participatedCampaigns.filter((campaign) => {
      const firstParticipant = campaign.participantes[0];
      return firstParticipant?.id_usuario !== userId;
    });

    // Get total count
    const allUserCampaigns = await prisma.compras_colectivas.findMany({
      where: {
        participantes: {
          some: {
            id_usuario: userId,
          },
        },
      },
      include: {
        participantes: {
          orderBy: {
            fecha_aporte: 'asc',
          },
        },
      },
    });

    const totalParticipated = allUserCampaigns.filter((campaign) => {
      const firstParticipant = campaign.participantes[0];
      return firstParticipant?.id_usuario !== userId;
    }).length;

    return res.json({
      success: true,
      data: {
        campaigns: userParticipatedCampaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalParticipated,
          pages: Math.ceil(totalParticipated / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user participated campaigns:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las campañas donde participas',
    });
  }
});

// GET /compras-colectivas/my-created - Get campaigns created by the authenticated user
router.get('/my-created', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const userId = req.user?.id_usuario;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Find campaigns where user is the first participant (creator)
    const createdCampaigns = await prisma.compras_colectivas.findMany({
      where: {
        participantes: {
          some: {
            id_usuario: userId,
            // Get campaigns where this user is among participants
          },
        },
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
          orderBy: {
            fecha_aporte: 'asc',
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    });

    // Filter to only campaigns where user is the creator (first participant)
    const userCreatedCampaigns = createdCampaigns.filter((campaign) => {
      const firstParticipant = campaign.participantes[0];
      return firstParticipant?.id_usuario === userId;
    });

    // Get total count of user's created campaigns
    const allUserCampaigns = await prisma.compras_colectivas.findMany({
      where: {
        participantes: {
          some: {
            id_usuario: userId,
          },
        },
      },
      include: {
        participantes: {
          orderBy: {
            fecha_aporte: 'asc',
          },
        },
      },
    });

    const totalCreated = allUserCampaigns.filter((campaign) => {
      const firstParticipant = campaign.participantes[0];
      return firstParticipant?.id_usuario === userId;
    }).length;

    return res.json({
      success: true,
      data: {
        campaigns: userCreatedCampaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCreated,
          pages: Math.ceil(totalCreated / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user created campaigns:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las campañas creadas',
    });
  }
});

// DELETE /compras-colectivas/:id/leave - Leave a campaign
router.delete('/:id/leave', authMiddleware, async (req: AuthenticatedRequest, res) => {
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

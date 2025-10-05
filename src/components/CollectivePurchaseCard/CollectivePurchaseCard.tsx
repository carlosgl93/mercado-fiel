import { CompraColectiva } from '@/types/api/comprasColectivas';
import { formatCLP } from '@/utils/formatCLP';
import {
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Typography,
} from '@mui/material';
import React from 'react';

interface CollectivePurchaseCardProps {
  campaign: CompraColectiva;
  onJoinPurchase: (campaign: CompraColectiva) => void;
  currentUserId?: number;
}

export const CollectivePurchaseCard: React.FC<CollectivePurchaseCardProps> = ({ 
  campaign, 
  onJoinPurchase,
  currentUserId
}) => {
  const progress = campaign.progreso;
  const progressPercentage = progress 
    ? (progress.cantidad_actual / campaign.cantidad_objetivo) * 100 
    : 0;

  const isUserParticipant = currentUserId && campaign.participantes?.some(
    p => p.id_usuario === currentUserId
  );

  const remaining = campaign.cantidad_objetivo - (progress?.cantidad_actual || 0);
  const daysRemaining = campaign.fecha_fin 
    ? Math.ceil((new Date(campaign.fecha_fin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate potential savings (example: up to 25% off)
  const originalPrice = campaign.producto?.precio_unitario || campaign.precio_objetivo;
  const savingsPercentage = ((Number(originalPrice) - campaign.precio_objetivo) / Number(originalPrice)) * 100;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        ...(campaign.estado === 'completada' && {
          opacity: 0.8,
          backgroundColor: 'success.50',
        })
      }}
    >
      {campaign.producto?.imagen_url && (
        <CardMedia
          component="img"
          height="200"
          image={campaign.producto.imagen_url}
          alt={campaign.producto.nombre_producto}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            {campaign.producto?.nombre_producto || campaign.nombre}
          </Typography>
          <Chip 
            icon={<GroupIcon />}
            label={
              campaign.estado === 'completada' ? 'Completada' :
              campaign.estado === 'cerrada' ? 'Cerrada' :
              'Activa'
            }
            color={
              campaign.estado === 'completada' ? 'success' :
              campaign.estado === 'cerrada' ? 'default' :
              'primary'
            }
            size="small"
          />
        </Box>
        
        {campaign.descripcion && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {campaign.descripcion}
          </Typography>
        )}

        {/* Provider Info */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Por: <strong>{campaign.proveedor?.nombre_negocio}</strong>
        </Typography>

        {/* Price Info */}
        <Box mb={2}>
          <Box display="flex" alignItems="baseline" gap={1}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {formatCLP(campaign.precio_objetivo)}
            </Typography>
            {savingsPercentage > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through' }}
              >
                {formatCLP(Number(originalPrice))}
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            por {campaign.producto?.unit_type === 'kg' ? 'kilogramo' : 'unidad'}
            {savingsPercentage > 0 && (
              <Chip 
                label={`${savingsPercentage.toFixed(0)}% OFF`} 
                color="success" 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
        </Box>

        {/* Progress Information */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {progress?.cantidad_actual || 0}/{campaign.cantidad_objetivo} {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progressPercentage, 100)} 
            sx={{ mb: 1, height: 6, borderRadius: 3 }}
          />
          
          <Typography 
            variant="caption" 
            color="text.secondary"
          >
            {progressPercentage.toFixed(0)}% completado
          </Typography>
        </Box>

        {/* Stats and Info */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <GroupIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {progress?.participantes_actuales || 0}/5 participantes
            </Typography>
          </Box>
          
          {daysRemaining !== null && daysRemaining > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
          
          <Box display="flex" alignItems="center" gap={1}>
            <LocalOfferIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {remaining} {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'} disponibles
            </Typography>
          </Box>

          {savingsPercentage > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main">
                Ahorro de hasta {savingsPercentage.toFixed(0)}%
              </Typography>
            </Box>
          )}

          {campaign.minimum_purchase && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Mínimo: {campaign.minimum_purchase} {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {isUserParticipant ? (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            sx={{ borderRadius: 2 }}
          >
            Ya eres participante
          </Button>
        ) : campaign.estado === 'completada' ? (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            sx={{ borderRadius: 2 }}
          >
            Campaña Completada
          </Button>
        ) : campaign.estado !== 'abierta' ? (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            sx={{ borderRadius: 2 }}
          >
            Campaña Cerrada
          </Button>
        ) : remaining <= 0 ? (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            sx={{ borderRadius: 2 }}
          >
            Sin Disponibilidad
          </Button>
        ) : (progress?.participantes_actuales || 0) >= 5 ? (
          <Button 
            fullWidth 
            variant="outlined"
            disabled
            sx={{ borderRadius: 2 }}
          >
            Máximo Participantes
          </Button>
        ) : (
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            onClick={() => onJoinPurchase(campaign)}
            sx={{ borderRadius: 2 }}
          >
            Unirse a la Compra
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
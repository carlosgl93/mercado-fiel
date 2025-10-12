import { comprasColectivasApi } from '@/api';
import { CompraColectiva } from '@/types/api/comprasColectivas';
import { formatCLP } from '@/utils/formatCLP';
import {
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface JoinCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaign: CompraColectiva;
  onSuccess?: () => void;
}

export const JoinCampaignModal: React.FC<JoinCampaignModalProps> = ({
  open,
  onClose,
  campaign,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // Calculate minimum required (20% of remaining)
  const currentTotal = campaign.progreso?.cantidad_actual || 0;
  const remaining = campaign.cantidad_objetivo - currentTotal;
  const minimumRequired20Percent = Math.ceil(remaining * 0.2);
  const effectiveMinimumDefault = Math.max(
    campaign.minimum_purchase || 1,
    minimumRequired20Percent,
  );

  const [cantidad, setCantidad] = useState<number>(effectiveMinimumDefault);
  const [error, setError] = useState<string>('');

  const joinCampaignMutation = useMutation(
    () => comprasColectivasApi.joinCompraColectiva(campaign.id_campana, { cantidad }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['collective-products']);
        queryClient.invalidateQueries(['campaigns']);
        queryClient.invalidateQueries(['campaign', campaign.id_campana]);
        onSuccess?.();
        handleClose();
      },
      onError: (error: any) => {
        console.error('Error joining campaign:', error);
        setError(error.response?.data?.message || 'Error al unirse a la campaña');
      },
    },
  );

  const handleClose = () => {
    setCantidad(effectiveMinimumDefault);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    setError('');

    // Validate minimum purchase (campaign setting)
    if (cantidad < (campaign.minimum_purchase || 1)) {
      setError(
        `La cantidad mínima requerida es ${campaign.minimum_purchase} ${
          campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'
        }`,
      );
      return;
    }

    // Validate 20% minimum business rule
    if (cantidad < minimumRequired20Percent) {
      setError(
        `Debes comprar al menos el 20% de la cantidad restante (${minimumRequired20Percent} ${
          campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'
        })`,
      );
      return;
    }

    // Validate maximum available
    if (cantidad > remaining) {
      setError(
        `La cantidad máxima disponible es ${remaining} ${
          campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'
        }`,
      );
      return;
    }

    joinCampaignMutation.mutate();
  };

  const currentProgress = campaign.progreso;
  const progressPercentage = currentProgress
    ? (currentProgress.cantidad_actual / campaign.cantidad_objetivo) * 100
    : 0;
  const effectiveMinimum = Math.max(campaign.minimum_purchase || 1, minimumRequired20Percent);
  const totalCost = cantidad * campaign.precio_objetivo;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>
        <Typography variant="h6" component="h2">
          Unirse a Compra Colectiva
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {campaign.nombre}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Product Info */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {campaign.producto?.nombre_producto}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Proveedor: {campaign.proveedor?.nombre_negocio}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatCLP(campaign.precio_objetivo)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                por {campaign.producto?.unit_type === 'kg' ? 'kilogramo' : 'unidad'}
              </Typography>
            </Box>
          </Box>

          {/* Progress Info */}
          <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <Typography variant="body1" fontWeight="medium">
                Progreso de la Campaña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentProgress?.participantes_actuales || 0}/5 participantes
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {currentProgress?.cantidad_actual || 0} de {campaign.cantidad_objetivo}{' '}
                {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {progressPercentage.toFixed(1)}%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {currentProgress?.participantes_actuales || 0} participantes
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOfferIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {remaining} {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}{' '}
                  disponibles
                </Typography>
              </Box>

              {campaign.fecha_fin && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Hasta {new Date(campaign.fecha_fin).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Purchase Amount */}
          <TextField
            fullWidth
            type="number"
            label={`Cantidad a Comprar (${
              campaign.producto?.unit_type === 'kg' ? 'Kilogramos' : 'Unidades'
            })`}
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            error={!!error}
            helperText={
              error ||
              `Mínimo requerido: ${effectiveMinimum} ${
                campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'
              } (20% del restante) • Disponible: ${remaining} ${
                campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'
              }`
            }
            required
            InputProps={{
              inputProps: {
                min: effectiveMinimum,
                max: remaining,
              },
            }}
          />

          {/* Total Cost */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: 1,
              borderColor: 'primary.200',
            }}
          >
            <Typography variant="h6" color="primary.main" gutterBottom>
              Total a Pagar: {formatCLP(totalCost)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cantidad} {campaign.producto?.unit_type === 'kg' ? 'kilogramos' : 'unidades'} ×{' '}
              {formatCLP(campaign.precio_objetivo)}
            </Typography>
          </Box>

          {/* 20% Rule Info */}
          <Alert severity="warning">
            <Typography variant="body2" gutterBottom>
              <strong>Regla de Participación:</strong>
            </Typography>
            <Typography variant="body2">
              Debes comprar al menos el 20% de la cantidad restante ({minimumRequired20Percent}{' '}
              {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}) para participar en esta
              compra colectiva.
            </Typography>
          </Alert>

          {/* Business Rules Info */}
          <Alert severity="info">
            <Typography variant="body2" gutterBottom>
              <strong>Al unirte a esta compra colectiva:</strong>
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
              <li>Te comprometes a comprar la cantidad especificada</li>
              <li>El pago se realizará al completarse la campaña</li>
              <li>Puedes salirte antes de que se complete la campaña</li>
              <li>Recibirás notificaciones sobre el progreso</li>
            </Typography>
          </Alert>

          {joinCampaignMutation.isError && error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={joinCampaignMutation.isLoading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={joinCampaignMutation.isLoading || cantidad <= 0}
        >
          {joinCampaignMutation.isLoading ? 'Uniéndose...' : `Unirse por ${formatCLP(totalCost)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
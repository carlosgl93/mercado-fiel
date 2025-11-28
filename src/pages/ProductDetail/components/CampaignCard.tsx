import { CheckCircle as CheckCircleIcon, Group as GroupIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, LinearProgress, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface CampaignCardProps {
  campaign: any;
  product: any;
  formatCurrency: (amount: number) => string;
  isUserParticipating?: boolean;
  userParticipation?: any;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  product,
  formatCurrency,
  isUserParticipating = false,
  userParticipation = null,
}) => {
  const theme = useTheme();
  console.log({ isUserParticipating, campaign, userParticipation });
  const location = useLocation();
  const isProductDetailPage = location.pathname.includes('product');

  return (
    <Card
      key={campaign.id_campana}
      sx={{
        mb: 2,
        border: `2px solid ${
          isUserParticipating ? theme.palette.success.main : theme.palette.primary.main
        }`,
        position: 'relative',
        ...(isUserParticipating && {
          bgcolor: `${theme.palette.success.main}08`, // Very light green background
          boxShadow: `0 4px 20px ${theme.palette.success.light}40`,
          '&:hover': {
            boxShadow: `0 6px 25px ${theme.palette.success.light}60`,
          },
          transition: 'box-shadow 0.3s ease-in-out',
        }),
      }}
    >
      {/* {isUserParticipating && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: 16,
            bgcolor: theme.palette.success.main,
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 1,
            boxShadow: `0 2px 8px ${theme.palette.success.dark}40`,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: `0 2px 8px ${theme.palette.success.dark}40`,
              },
              '50%': {
                boxShadow: `0 4px 16px ${theme.palette.success.dark}60`,
              },
              '100%': {
                boxShadow: `0 2px 8px ${theme.palette.success.dark}40`,
              },
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 14 }} />
          Participando
        </Box>
      )} */}

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            {isProductDetailPage ? null : (
              <Typography variant="h6" fontWeight="600">
                {campaign.nombre}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              {campaign.descripcion}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Precio objetivo: <strong>{formatCurrency(Number(campaign.precio_objetivo))}</strong>{' '}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ahorro:{' '}
              <strong>
                {formatCurrency(product.precioUnitario - Number(campaign.precio_objetivo))}
              </strong>{' '}
            </Typography>
            {isUserParticipating && userParticipation && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 600 }}>
                <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                Tu aporte: {userParticipation.cantidad} unidades -{' '}
                {formatCurrency(Number(userParticipation.monto_aportado))}
              </Typography>
            )}
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            <Chip
              label={campaign.estado === 'abierta' ? 'Activa' : 'Cerrada'}
              color={campaign.estado === 'abierta' ? 'success' : 'default'}
              size="small"
            />
            {isUserParticipating && (
              <Chip
                label="Participando"
                color="success"
                size="small"
                variant="outlined"
                icon={<CheckCircleIcon />}
              />
            )}
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2">
              Progreso: {campaign.progreso?.cantidad_actual || 0} / {campaign.cantidad_objetivo}
            </Typography>
            <Typography variant="body2" color="primary">
              {Math.round(
                ((campaign.progreso?.cantidad_actual || 0) / campaign.cantidad_objetivo) * 100,
              )}
              %
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((campaign.progreso?.cantidad_actual || 0) / campaign.cantidad_objetivo) * 100}
            color="secondary"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {campaign.progreso?.participantes_actuales || 0} participantes
            </Typography>
            <ScheduleIcon sx={{ fontSize: 16 }} />
            {campaign.fecha_fin && (
              <Typography variant="body2">
                Termina: {new Date(campaign.fecha_fin).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
import { comprasColectivasApi } from '@/api/comprasColectivas';
import { useAuth } from '@/hooks/useAuthSupabase';
import { CompraColectiva } from '@/types/api/comprasColectivas';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Remove as RemoveIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface OtherCreatedCampaignsSectionProps {
  product: any;
  user: any;
  onCreateCampaign: () => void;
  formatCurrency: (amount: number) => string;
}

export const OtherCreatedCampaignsSection: React.FC<OtherCreatedCampaignsSectionProps> = ({
  product,
  user,
  onCreateCampaign,
  formatCurrency,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [campaignQuantities, setCampaignQuantities] = useState<{ [key: number]: number }>({});

  // Fetch all active campaigns (excluding campaigns for the current product)
  const { data: otherCampaignsResponse, isLoading } = useQuery({
    queryKey: ['other-collective-campaigns', product?.idProducto],
    queryFn: () =>
      comprasColectivasApi.getComprasColectivas({
        estado: 'abierta',
        page: 1,
        limit: 20,
      }),
    enabled: !!product?.idProducto,
  });

  // Filter out campaigns for the current product to show truly "other" campaigns
  const otherCampaigns = React.useMemo(() => {
    if (!otherCampaignsResponse?.data?.campaigns || !product?.idProducto) return [];
    
    return otherCampaignsResponse.data.campaigns.filter(
      (campaign: CompraColectiva) => campaign.id_producto !== product.idProducto
    );
  }, [otherCampaignsResponse, product?.idProducto]);

  // Check if the current product has any campaigns
  const currentProductCampaigns = React.useMemo(() => {
    if (!otherCampaignsResponse?.data?.campaigns || !product?.idProducto) return [];
    
    return otherCampaignsResponse.data.campaigns.filter(
      (campaign: CompraColectiva) => campaign.id_producto === product.idProducto
    );
  }, [otherCampaignsResponse, product?.idProducto]);

  // Mutation for joining a campaign
  const joinCampaignMutation = useMutation({
    mutationFn: (data: { campaignId: number; cantidad: number }) =>
      comprasColectivasApi.joinCompraColectiva(data.campaignId, { cantidad: data.cantidad }),
    onSuccess: () => {
      queryClient.invalidateQueries(['other-collective-campaigns']);
      queryClient.invalidateQueries(['collective-campaigns']);
    },
    onError: (error: any) => {
      console.error('Error joining campaign:', error);
    },
  });

  const getCampaignQuantity = (campaignId: number): number => {
    return campaignQuantities[campaignId] || 1;
  };

  const setCampaignQuantity = (campaignId: number, quantity: number) => {
    setCampaignQuantities(prev => ({
      ...prev,
      [campaignId]: Math.max(1, quantity)
    }));
  };

  const handleCampaignQuantityChange = (campaignId: number, delta: number) => {
    const currentQuantity = getCampaignQuantity(campaignId);
    setCampaignQuantity(campaignId, currentQuantity + delta);
  };

  const handleJoinCampaign = (campaign: CompraColectiva) => {
    if (!authUser?.data?.idUsuario) {
      // Navigate to login or show auth modal
      return;
    }

    const quantity = getCampaignQuantity(campaign.id_campana);
    joinCampaignMutation.mutate({
      campaignId: campaign.id_campana,
      cantidad: quantity,
    });
  };

  const isUserParticipant = (campaign: CompraColectiva): boolean => {
    if (!authUser?.data?.idUsuario || !campaign.participantes) return false;
    return campaign.participantes.some(p => p.id_usuario === authUser.data.idUsuario);
  };

  if (isLoading) {
    return (
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Otras Oportunidades de Compra Colectiva
      </Typography>

      {/* Show if current product has campaigns */}
      {currentProductCampaigns.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center">
            <CheckCircleIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Este producto tiene {currentProductCampaigns.length} campaña(s) colectiva(s) activa(s). 
              ¡Revisa la sección de arriba para participar!
            </Typography>
          </Box>
        </Alert>
      )}

      {otherCampaigns.length > 0 ? (
        otherCampaigns.map((campaign: CompraColectiva) => {
          const progress = campaign.progreso;
          const progressPercentage = progress 
            ? (progress.cantidad_actual / campaign.cantidad_objetivo) * 100 
            : 0;
          const remaining = campaign.cantidad_objetivo - (progress?.cantidad_actual || 0);
          const isParticipant = isUserParticipant(campaign);
          const campaignQuantity = getCampaignQuantity(campaign.id_campana);

          return (
            <Card
              key={campaign.id_campana}
              sx={{ 
                mb: 2, 
                border: `2px solid ${theme.palette.secondary.main}`,
                ...(isParticipant && {
                  border: `2px solid ${theme.palette.success.main}`,
                  bgcolor: `${theme.palette.success.main}08`,
                })
              }}
            >
              <CardContent>
                {/* Product Badge */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {campaign.nombre}
                      </Typography>
                      {isParticipant && (
                        <Chip
                          label="Participando"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                      Producto: {campaign.producto?.nombre_producto}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Por: {campaign.proveedor?.nombre_negocio}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Precio objetivo: <strong>{formatCurrency(campaign.precio_objetivo)}</strong>
                      {campaign.producto?.precio_unitario && (
                        <span> (ahorra {formatCurrency(Number(campaign.producto.precio_unitario) - campaign.precio_objetivo)})</span>
                      )}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={campaign.estado === 'abierta' ? 'Activa' : 'Cerrada'}
                    color={campaign.estado === 'abierta' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                {/* Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      Progreso: {progress?.cantidad_actual || 0} / {campaign.cantidad_objetivo} {campaign.producto?.unit_type === 'kg' ? 'kg' : 'unidades'}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {Math.round(progressPercentage)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progressPercentage, 100)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Campaign Info */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2">
                      <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {progress?.participantes_actuales || 0} participantes
                    </Typography>
                    {campaign.fecha_fin && (
                      <Typography variant="body2">
                        <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Termina: {new Date(campaign.fecha_fin).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Join Campaign Controls */}
                  {campaign.estado === 'abierta' && user && !isParticipant && remaining > 0 && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleCampaignQuantityChange(campaign.id_campana, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={campaignQuantity}
                        onChange={(e) =>
                          setCampaignQuantity(campaign.id_campana, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleCampaignQuantityChange(campaign.id_campana, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleJoinCampaign(campaign)}
                        disabled={joinCampaignMutation.isLoading}
                      >
                        Unirse ({formatCurrency(campaign.precio_objetivo * campaignQuantity)})
                      </Button>
                    </Box>
                  )}

                  {isParticipant && (
                    <Button variant="outlined" size="small" disabled>
                      Ya participas
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })
      ) : (
        /* Empty State with CTA */
        <Card sx={{ textAlign: 'center', p: 4, bgcolor: 'grey.50' }}>
          <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            ¡No hay otras compras colectivas activas!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {product?.elegibleCompraColectiva 
              ? 'Sé el primero en crear una compra colectiva para este producto y aprovecha los descuentos por volumen.'
              : 'Este producto no es elegible para compras colectivas, pero puedes explorar otros productos que sí lo son.'
            }
          </Typography>
          
          {product?.elegibleCompraColectiva && user && (
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              onClick={onCreateCampaign}
              sx={{ mb: 2 }}
            >
              Crear Primera Compra Colectiva
            </Button>
          )}
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/compras-colectivas')}
            >
              Ver Todas las Compras Colectivas
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};
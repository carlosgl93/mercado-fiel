import { comprasColectivasApi } from '@/api';
import { campaignsApi } from '@/api/campaigns';
import { productsApi } from '@/api/products';
import { CreateCampaignModal } from '@/components';
import { useAuth } from '@/hooks/useAuthSupabase';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  LocalOffer as LocalOfferIcon,
  Remove as RemoveIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

interface CollectiveCampaign {
  id: number;
  name: string;
  targetQuantity: number;
  currentQuantity: number;
  targetPrice: number;
  currentPrice: number;
  endDate: string;
  participants: number;
  status: 'active' | 'completed' | 'expired';
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [campaignQuantity, setCampaignQuantity] = useState(1);
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);

  // Query for product details
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(parseInt(id || '0')),
    enabled: !!id,
  });

  // Query for collective campaigns for this product
  const { data: campaignsResponse, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns', 'product', id],
    queryFn: () => campaignsApi.getCampaignsByProduct(parseInt(id || '0')),
    enabled: !!id,
  });

  // Query for collective purchase campaigns for this product
  const { data: collectiveCampaignsResponse, isLoading: isLoadingCollectiveCampaigns } = useQuery({
    queryKey: ['collective-campaigns', 'product', id],
    queryFn: () =>
      comprasColectivasApi.getComprasColectivas({
        id_producto: parseInt(id || '0'),
        estado: 'abierta',
      }),
    enabled: !!id,
  });

  // Mutation for joining a campaign
  const joinCampaignMutation = useMutation({
    mutationFn: (data: { campaignId: number; quantity: number; amount: number }) =>
      campaignsApi.joinCampaign(data.campaignId, data.quantity, data.amount),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', 'product', id]);
      // Show success message
    },
    onError: (error: any) => {
      // Show error message
    },
  });

  const product = productResponse?.data;
  const campaigns = campaignsResponse?.data || [];
  const collectiveCampaigns = collectiveCampaignsResponse?.data?.campaigns || [];

  const handleQuantityChange = (delta: number) => {
    console.log({ quantity, product });
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleCampaignQuantityChange = (delta: number) => {
    setCampaignQuantity(Math.max(1, campaignQuantity + delta));
  };

  const handleJoinCampaign = (campaign: CollectiveCampaign) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = campaign.targetPrice * campaignQuantity;
    joinCampaignMutation.mutate({
      campaignId: campaign.id,
      quantity: campaignQuantity,
      amount,
    });
  };

  const calculateCurrentPrice = (basePrice: number, quantity: number, discounts: any[]) => {
    if (!discounts || discounts.length === 0) return basePrice;

    // Find the applicable discount based on quantity
    const applicableDiscount = discounts
      .filter((d) => quantity >= d.cantidadMinima)
      .sort((a, b) => b.cantidadMinima - a.cantidadMinima)[0];

    if (!applicableDiscount) return basePrice;
    console.log({ applicableDiscount, basePrice, quantity });

    return basePrice * (1 - applicableDiscount.porcentajeDescuento / 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  if (isLoadingProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (productError || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudo cargar la información del producto.
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Container>
    );
  }

  const currentPrice = calculateCurrentPrice(
    product.precioUnitario,
    quantity,
    product.descuentosCantidad || [],
  );
  const totalPrice = currentPrice * quantity;

  console.log({ currentPrice, totalPrice, quantity, product });

  return (
    <Box
      sx={{
        bgcolor: '#F6F6F4',
        minHeight: '100vh',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: '#4CAF4F',
              },
            }}
          >
            Volver
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Product Information */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, mb: 3 }}>
              {/* Product Header */}
              <Box display="flex" alignItems="flex-start" gap={3} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: product.imagenUrl ? 'transparent' : alpha('#4CAF4F', 0.1),
                    borderRadius: 2,
                    backgroundImage: product.imagenUrl ? `url(${product.imagenUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!product.imagenUrl && (
                    <Typography variant="h3" color="primary">
                      {product.nombreProducto.charAt(0)}
                    </Typography>
                  )}
                </Box>

                <Box flex={1}>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    {product.nombreProducto}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {product.descripcion || 'Sin descripción disponible'}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {formatCurrency(product.precioUnitario)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      por {product.unitType === 'kg' ? 'kilogramo' : 'unidad'}
                    </Typography>
                  </Box>

                  {/* Supplier Link */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/proveedor/${product.idProveedor}`)}
                  >
                    Ver proveedor
                  </Button>
                </Box>
              </Box>

              {/* Volume Discounts */}
              {product.descuentosCantidad && product.descuentosCantidad.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                    <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Descuentos por Volumen
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Cantidad Mínima</TableCell>
                          <TableCell>Descuento</TableCell>
                          <TableCell>Precio Final</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.descuentosCantidad.map((discount, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              {discount.cantidadMinima}{' '}
                              {product.unitType === 'kg' ? 'kg' : 'unidades'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${discount.descuentoPorcentaje}% OFF`}
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography color="primary" fontWeight="600">
                                {formatCurrency(
                                  product.precioUnitario *
                                    (1 - (discount.descuentoPorcentaje || 0) / 100),
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Collective Purchase Campaigns */}
              {product.elegibleCompraColectiva && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" fontWeight="600">
                      <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Compras Colectivas
                    </Typography>

                    {user && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<GroupIcon />}
                        onClick={() => setCreateCampaignModalOpen(true)}
                      >
                        Crear Campaña
                      </Button>
                    )}
                  </Box>

                  {collectiveCampaigns.length > 0 ? (
                    collectiveCampaigns.map((campaign) => (
                      <Card
                        key={campaign.id_campana}
                        sx={{ mb: 2, border: `2px solid ${theme.palette.primary.main}` }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                {campaign.nombre}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {campaign.descripcion}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Precio objetivo:{' '}
                                <strong>{formatCurrency(Number(campaign.precio_objetivo))}</strong>{' '}
                                (ahorra{' '}
                                {formatCurrency(
                                  product.precioUnitario - Number(campaign.precio_objetivo),
                                )}
                                )
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
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="body2">
                                Progreso: {campaign.progreso?.cantidad_actual || 0} /{' '}
                                {campaign.cantidad_objetivo}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                {Math.round(
                                  ((campaign.progreso?.cantidad_actual || 0) /
                                    campaign.cantidad_objetivo) *
                                    100,
                                )}
                                %
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                ((campaign.progreso?.cantidad_actual || 0) /
                                  campaign.cantidad_objetivo) *
                                100
                              }
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="body2">
                                <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {campaign.progreso?.participantes_actuales || 0} participantes
                              </Typography>
                              {campaign.fecha_fin && (
                                <Typography variant="body2">
                                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  Termina: {new Date(campaign.fecha_fin).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        No hay campañas colectivas activas para este producto.
                        {user && ' ¡Sé el primero en crear una!'}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Old Collective Campaigns (keeping for compatibility) */}
              {campaigns.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Otras Campañas Activas
                  </Typography>

                  {campaigns.map((campaign: CollectiveCampaign) => (
                    <Card
                      key={campaign.id}
                      sx={{ mb: 2, border: `2px solid ${theme.palette.secondary.main}` }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          sx={{ mb: 2 }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              {campaign.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Precio objetivo:{' '}
                              <strong>{formatCurrency(campaign.targetPrice)}</strong> (ahorra{' '}
                              {formatCurrency(product.precioUnitario - campaign.targetPrice)})
                            </Typography>
                          </Box>
                          <Chip
                            label={campaign.status === 'active' ? 'Activa' : 'Finalizada'}
                            color={campaign.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>

                        {/* Progress */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <Typography variant="body2">
                              Progreso: {campaign.currentQuantity} / {campaign.targetQuantity}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {Math.round(
                                (campaign.currentQuantity / campaign.targetQuantity) * 100,
                              )}
                              %
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(campaign.currentQuantity / campaign.targetQuantity) * 100}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        <Box display="flex" justify-content="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body2">
                              <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              {campaign.participants} participantes
                            </Typography>
                            <Typography variant="body2">
                              <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              Termina: {new Date(campaign.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>

                          {campaign.status === 'active' && user && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleCampaignQuantityChange(-1)}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <TextField
                                size="small"
                                value={campaignQuantity}
                                onChange={(e) =>
                                  setCampaignQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                }
                                sx={{ width: 60 }}
                                inputProps={{ min: 1, style: { textAlign: 'center' } }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleCampaignQuantityChange(1)}
                              >
                                <AddIcon />
                              </IconButton>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleJoinCampaign(campaign)}
                                disabled={joinCampaignMutation.isLoading}
                              >
                                Unirse ({formatCurrency(campaign.targetPrice * campaignQuantity)})
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Purchase Panel */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Comprar Producto
              </Typography>

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Cantidad:
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => handleQuantityChange(-1)}>
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ min: 1, style: { textAlign: 'center' } }}
                  />
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <AddIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {product.unitType === 'kg' ? 'kg' : 'unidades'}
                  </Typography>
                </Box>
              </Box>

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Precio unitario:</Typography>
                  <Typography variant="body2">{formatCurrency(product.precioUnitario)}</Typography>
                </Box>

                {currentPrice < product.precioUnitario && (
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="primary">
                      Precio con descuento:
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="600">
                      {formatCurrency(currentPrice)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="600">
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    {formatCurrency(totalPrice)}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box display="flex" flexDirection="column" gap={2}>
                <Button variant="contained" fullWidth startIcon={<ShoppingCartIcon />} size="large">
                  Agregar al Carrito
                </Button>

                <Button variant="outlined" fullWidth size="large">
                  Comprar Ahora
                </Button>
              </Box>

              {/* Discount Notice */}
              {product.descuentosCantidad && product.descuentosCantidad.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 1 }} />
                  ¡Compra más y ahorra! Ver descuentos por volumen arriba.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Create Campaign Modal */}
      {product && product.elegibleCompraColectiva && (
        <CreateCampaignModal
          open={createCampaignModalOpen}
          onClose={() => setCreateCampaignModalOpen(false)}
          product={product}
          onSuccess={() => {
            // Refresh collective campaigns
            queryClient.invalidateQueries(['collective-campaigns', 'product', id]);
            queryClient.invalidateQueries(['collective-campaigns']);
          }}
        />
      )}
    </Box>
  );
};

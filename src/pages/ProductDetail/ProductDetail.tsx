import { CreateCampaignModal } from '@/components';
import { useAuth } from '@/hooks/useAuthSupabase';
import { trackProductView } from '@/services/analyticsService';
import { useShoppingCartService } from '@/services/shoppingCartService';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';

// Custom hooks
import { useProductDetail, useProductPricing, useUserCampaignParticipation } from './hooks';

// Components
import {
  CartNotifications,
  CollectiveCampaignsSection,
  OtherCreatedCampaignsSection,
  ProductInfo,
  PurchasePanel,
} from './components';

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
  const theme = useTheme();
  const { user, supplier } = useAuth();
  const {
    addProductToCart,
    removeProductFromCart,
    getProductQuantityInCart,
    snackbar,
    closeSnackbar,
  } = useShoppingCartService();

  const {
    id,
    navigate,
    queryClient,
    product,
    campaigns,
    collectiveCampaigns,
    isLoadingProduct,
    productError,
    createCampaignModalOpen,
    setCreateCampaignModalOpen,
    campaignQuantity,
    handleCampaignQuantityChange,
    handleJoinCampaign,
    setCampaignQuantity,
    joinCampaignMutation,
  } = useProductDetail();

  const cartQuantity = product ? getProductQuantityInCart(product.idProducto) : 0;
  const { currentPrice, totalPrice, formatCurrency } = useProductPricing(product, cartQuantity);

  // Check if current user is the product supplier (anti-exploit validation)
  const isUserProductSupplier = Boolean(
    product && supplier && product.idProveedor === supplier.idProveedor,
  );

  // Get user participation status in campaigns
  const { hasParticipations, getParticipatedCampaigns } =
    useUserCampaignParticipation(collectiveCampaigns);

  const handleAddToCart = () => {
    if (product) addProductToCart(product, 1);
  };

  const handleRemoveFromCart = () => {
    if (product) removeProductFromCart(product, 1);
  };

  const handleNavigateToSupplier = () => {
    if (product) {
      navigate(`/proveedor/${product.idProveedor}`);
    }
  };

  const handleCreateCampaignSuccess = () => {
    queryClient.invalidateQueries(['collective-campaigns', 'product', id]);
    queryClient.invalidateQueries(['collective-campaigns']);
  };

  // Track product view when product data loads
  useEffect(() => {
    if (product && !isLoadingProduct) {
      trackProductView(product);
    }
  }, [product, isLoadingProduct]);

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

  return (
    <Box sx={{ bgcolor: '#F6F6F4', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { color: '#4CAF4F' },
            }}
          >
            Volver
          </Button>
        </Box>

        {/* User Participation Banner */}
        {user && hasParticipations && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  ¡Estás participando en compras colectivas de este producto!
                </Typography>
                <Typography variant="body2">
                  Participas en {getParticipatedCampaigns().length} campaña(s) activa(s).
                  {(() => {
                    const totalCommitment = getParticipatedCampaigns().reduce((sum, campaign) => {
                      const userParticipation = campaign.participantes?.find(
                        (p: any) => p.id_usuario === user.data?.idUsuario,
                      );
                      return sum + (userParticipation?.monto_aporte || 0);
                    }, 0);

                    if (totalCommitment > 0) {
                      return ` Tu compromiso total: ${formatCurrency(totalCommitment)}.`;
                    }
                    return '';
                  })()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Revisa el progreso en la sección de Compras Colectivas más abajo.
                </Typography>
              </Box>
            </Box>
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Product Information */}
          <Grid item xs={12} md={8}>
            <ProductInfo
              product={product}
              onNavigateToSupplier={handleNavigateToSupplier}
              formatCurrency={formatCurrency}
            />

            {/* Purchase Panel */}
            <Grid item xs={12} md={4}>
              <PurchasePanel
                product={product}
                cartQuantity={cartQuantity}
                currentPrice={currentPrice}
                totalPrice={totalPrice}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                formatCurrency={formatCurrency}
              />
            </Grid>

            <CollectiveCampaignsSection
              product={product}
              campaigns={collectiveCampaigns}
              isUserProductSupplier={isUserProductSupplier}
              user={user}
              onCreateCampaign={() => setCreateCampaignModalOpen(true)}
              formatCurrency={formatCurrency}
            />

            <OtherCreatedCampaignsSection
              product={product}
              user={user}
              onCreateCampaign={() => setCreateCampaignModalOpen(true)}
              formatCurrency={formatCurrency}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Create Campaign Modal */}
      {product?.elegibleCompraColectiva && (
        <CreateCampaignModal
          open={createCampaignModalOpen}
          onClose={() => setCreateCampaignModalOpen(false)}
          product={product}
          onSuccess={handleCreateCampaignSuccess}
        />
      )}

      <CartNotifications snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

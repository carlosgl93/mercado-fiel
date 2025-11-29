import { productsApi } from '@/api/products';
import { suppliersApi } from '@/api/suppliers';
import { useAuth } from '@/hooks/useAuthSupabase';
import { ProductCard } from '@/pages/ExplorarProductos/components/ProductCard';
import { trackSupplierProfileView } from '@/services/analyticsService';
import { useShoppingCartService } from '@/services/shoppingCartService';
import { Product } from '@/types/products';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export const PublicSupplierProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  // Shopping cart service
  const {
    addProductToCart,
    removeProductFromCart,
    getProductQuantityInCart,
    snackbar,
    closeSnackbar,
  } = useShoppingCartService();

  const handleAddToCartProduct = (product: Product, cantidad = 1) => {
    addProductToCart(product, cantidad);
  };

  const handleRemoveFromCartProduct = (product: Product, cantidad = 1) => {
    removeProductFromCart(product, cantidad);
  };

  // Query for supplier data
  const {
    data: supplierResponse,
    isLoading: isLoadingSupplier,
    error: supplierError,
  } = useQuery({
    queryKey: ['supplier', 'public', id],
    queryFn: () => suppliersApi.getSupplier(parseInt(id || '0')),
    enabled: !!id,
  });

  // Query for supplier's products
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'supplier', id],
    queryFn: () => productsApi.getProducts({ proveedor: id }),
    enabled: !!id,
  });

  const supplier = supplierResponse?.data;
  const products = productsResponse?.data?.productos || [];

  // Track supplier profile view when supplier data is loaded
  React.useEffect(() => {
    if (supplier && !isLoadingSupplier) {
      trackSupplierProfileView(
        supplier.idProveedor,
        supplier.nombreNegocio || 'Proveedor',
        products.length,
        user?.data?.idUsuario,
      );
    }
  }, [supplier?.idProveedor, isLoadingSupplier]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <Box display="flex" alignItems="center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} sx={{ color: '#FF8A00', fontSize: 20 }} />
        ))}
        {hasHalfStar && (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <StarIcon sx={{ color: '#d1d5db', fontSize: 20 }} />
            <StarIcon
              sx={{
                color: '#FF8A00',
                fontSize: 20,
                position: 'absolute',
                overflow: 'hidden',
                width: '50%',
              }}
            />
          </Box>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} sx={{ color: '#d1d5db', fontSize: 20 }} />
        ))}
        <Typography variant="body1" fontWeight="bold" sx={{ color: '#FF8A00', ml: 1 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  if (isLoadingSupplier) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (supplierError || !supplier) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudo cargar la información del proveedor.
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/buscar')}>
          Volver al buscador
        </Button>
      </Container>
    );
  }

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
            onClick={() => navigate('/buscar')}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: '#4CAF4F',
                transform: 'translateX(-5px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Volver al buscador
          </Button>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'white',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              bgcolor: alpha('#4CAF4F', 0.1),
              p: { xs: 3, md: 4 },
              textAlign: 'center',
            }}
          >
            <Avatar
              src={(supplier.usuario as any)?.profile_picture_url || ''}
              sx={{
                width: { xs: 80, md: 120 },
                height: { xs: 80, md: 120 },
                mx: 'auto',
                mb: 2,
                border: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="h4" color="primary">
                {supplier.nombreNegocio?.charAt(0) || 'P'}
              </Typography>
            </Avatar>

            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                color: '#3A3A3A',
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              {supplier.nombreNegocio}
            </Typography>

            {supplier.destacado && (
              <Chip label="Proveedor Destacado" color="primary" sx={{ mb: 2 }} />
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              {/* <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                size="large"
                onClick={() => navigate(`/productos?proveedor=${id}`)}
              >
                Ver Productos
              </Button> */}
              <IconButton
                color="primary"
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton
                color="primary"
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Contact Information */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                {/* Description */}
                {supplier.descripcion && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="600"
                      sx={{ color: '#3A3A3A', mb: 2 }}
                    >
                      Sobre nosotros
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        fontSize: '1.1rem',
                      }}
                    >
                      {supplier.descripcion}
                    </Typography>
                  </Box>
                )}

                {/* Products Section */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="600"
                      sx={{ color: '#3A3A3A' }}
                    >
                      Productos Disponibles ({products.length})
                    </Typography>
                    {/* {products.length > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/productos?proveedor=${id}`)}
                      >
                        Ver todos
                      </Button>
                    )} */}
                  </Box>

                  {isLoadingProducts ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : products.length > 0 ? (
                    <Grid container spacing={2}>
                      {products.slice(0, 8).map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.idProducto}>
                          <ProductCard product={product} disabled={false} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.grey[100], 0.5),
                      }}
                    >
                      <Typography color="text.secondary">
                        Este proveedor aún no ha agregado productos.
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 20 }}>
                  {/* Contact Information Card */}
                  {/* <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ mb: 2 }}
                      >
                        Información de Contacto
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {supplier.telefonoContacto && (
                          <Box display="flex" alignItems="center">
                            <PhoneIcon sx={{ color: '#4CAF4F', mr: 1.5 }} />
                            <Typography variant="body2">
                              {supplier.telefonoContacto}
                            </Typography>
                          </Box>
                        )}

                        {supplier.email && (
                          <Box display="flex" alignItems="center">
                            <EmailIcon sx={{ color: '#4CAF4F', mr: 1.5 }} />
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {supplier.email}
                            </Typography>
                          </Box>
                        )}

                        {supplier.radioEntregaKm && (
                          <Box display="flex" alignItems="center">
                            <LocationIcon sx={{ color: '#4CAF4F', mr: 1.5 }} />
                            <Typography variant="body2">
                              Entrega hasta {supplier.radioEntregaKm} km
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card> */}

                  {/* Shipping Information Card */}
                  {/* <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                        Información de Envío
                      </Typography>

                      <Box display="flex" alignItems="center">
                        <ShippingIcon sx={{ color: '#4CAF4F', mr: 1.5 }} />
                        <Typography variant="body2">
                          {supplier.cobraEnvio
                            ? `Envío gratis desde $${supplier.envioGratisDesde || 0}`
                            : 'Envío siempre gratis'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card> */}

                  {/* Rating Card */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                        Valoración
                      </Typography>

                      <Box sx={{ textAlign: 'center' }}>
                        {renderStars(4.5)}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Basado en reseñas de clientes
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for cart notifications */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default PublicSupplierProfile;

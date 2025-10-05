import { productsApi } from '@/api';
import { DashboardHeader } from '@/components';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Product, ProductFilters } from '@/types/products';
import { formatCLP } from '@/utils/formatCLP';
import {
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface CollectivePurchaseCardProps {
  product: Product;
  onJoinPurchase: (product: Product) => void;
}

const CollectivePurchaseCard: React.FC<CollectivePurchaseCardProps> = ({ 
  product, 
  onJoinPurchase 
}) => {
  // Mock data for collective purchase progress
  const mockProgress = {
    currentParticipants: Math.floor(Math.random() * 50) + 10,
    targetParticipants: 100,
    timeRemaining: Math.floor(Math.random() * 7) + 1, // days
  };

  const progressPercentage = (mockProgress.currentParticipants / mockProgress.targetParticipants) * 100;

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
        }
      }}
    >
      {product.imagenUrl && (
        <CardMedia
          component="img"
          height="200"
          image={product.imagenUrl}
          alt={product.nombreProducto}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            {product.nombreProducto}
          </Typography>
          <Chip 
            icon={<GroupIcon />}
            label="Compra Colectiva" 
            color="primary" 
            size="small"
          />
        </Box>
        
        {product.descripcion && (
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
            {product.descripcion}
          </Typography>
        )}

        <Box mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatCLP(product.precioUnitario)}
            <Typography component="span" variant="body2" color="text.secondary" ml={1}>
              por {product.unitType === 'kg' ? 'kilogramo' : 'unidad'}
            </Typography>
          </Typography>
        </Box>

        {/* Progress Information */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progreso de la compra
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {mockProgress.currentParticipants}/{mockProgress.targetParticipants} participantes
            </Typography>
          </Box>
          
          <Box position="relative" mb={2}>
            <Box
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  backgroundColor: 'primary.main',
                  transition: 'width 0.3s ease-in-out',
                }}
              />
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ position: 'absolute', right: 0, top: -20 }}
            >
              {progressPercentage.toFixed(0)}%
            </Typography>
          </Box>
        </Box>

        {/* Time and Benefits */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {mockProgress.timeRemaining} días restantes
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon fontSize="small" color="success" />
            <Typography variant="body2" color="success.main">
              Hasta 25% de descuento al completarse
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <LocalOfferIcon fontSize="small" color="secondary" />
            <Typography variant="body2" color="text.secondary">
              Sin costo de envío
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          size="large"
          onClick={() => onJoinPurchase(product)}
          sx={{ borderRadius: 2 }}
        >
          Unirse a la Compra
        </Button>
      </CardActions>
    </Card>
  );
};

export const ComprasColectivas: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [filters] = useState<ProductFilters>({
    disponible: true,
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // Query for products eligible for collective purchases
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['collective-products', filters],
    queryFn: () => productsApi.getProducts({
      ...filters,
      // Note: We'll need to add filtering by elegibleCompraColectiva in the backend
    }),
    keepPreviousData: true,
  });

  const handleJoinPurchase = (product: Product) => {
    // TODO: Implement join collective purchase logic
    console.log('Joining collective purchase for:', product.nombreProducto);
    // This will open a modal or navigate to a join purchase page
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar las compras colectivas. Intenta recargar la página.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      <DashboardHeader 
        title="Compras Colectivas"
        description="Únete a compras grupales y obtén los mejores precios"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Compras Colectivas' }
        ]}
        onBack={() => navigate('/')}
        icon={<GroupIcon />}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <GroupIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Compras Colectivas
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Únete con otros compradores para obtener mejores precios, descuentos exclusivos
          </Typography>
        </Box>

        {/* Benefits Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Mejores Precios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Obtén descuentos de hasta 25% comprando en grupo
              </Typography>
            </Card>
          </Grid>
       
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <GroupIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Comunidad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conecta con otros compradores y proveedores locales
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Products Section */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Compras Colectivas Activas
        </Typography>

        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: 400 }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : productsData?.data?.productos?.length === 0 ? (
          <Card sx={{ textAlign: 'center', p: 6 }}>
            <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No hay compras colectivas activas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Las compras colectivas aparecerán aquí cuando los proveedores las publiquen
            </Typography>
            <Button variant="contained" href="/explorar-productos">
              Explorar Productos
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {productsData?.data?.productos
              ?.filter(product => product.elegibleCompraColectiva) // Filter on frontend for now
              ?.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.idProducto}>
                  <CollectivePurchaseCard 
                    product={product} 
                    onJoinPurchase={handleJoinPurchase}
                  />
                </Grid>
              ))}
          </Grid>
        )}

        {/* Empty State if no collective purchase products */}
        {productsData?.data?.productos && 
         productsData.data.productos.filter(p => p.elegibleCompraColectiva).length === 0 && (
          <Card sx={{ textAlign: 'center', p: 6, mt: 3 }}>
            <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No hay productos elegibles para compras colectivas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Los proveedores aún no han habilitado productos para compras colectivas
            </Typography>
            <Button variant="contained" href="/explorar-productos">
              Explorar Todos los Productos
            </Button>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ComprasColectivas;
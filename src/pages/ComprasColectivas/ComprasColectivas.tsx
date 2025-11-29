import { comprasColectivasApi } from '@/api';
import { CollectivePurchaseCard, DashboardHeader, JoinCampaignModal } from '@/components';
import { useAuth } from '@/hooks/useAuthSupabase';
import { trackCampaignJoin } from '@/services/analyticsService';
import { CompraColectiva, CompraColectivaFilters } from '@/types/api/comprasColectivas';
import { Group as GroupIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
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

export const ComprasColectivas: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [filters] = useState<CompraColectivaFilters>({
    page: 1,
    limit: 12,
    estado: 'abierta',
  });

  const [selectedCampaign, setSelectedCampaign] = useState<CompraColectiva | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // Query for active collective purchase campaigns
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['collective-campaigns', filters],
    queryFn: () => comprasColectivasApi.getComprasColectivas(filters),
    keepPreviousData: true,
  });

  const handleJoinPurchase = (campaign: CompraColectiva) => {
    setSelectedCampaign(campaign);
    setJoinModalOpen(true);
  };

  const handleJoinModalClose = () => {
    setJoinModalOpen(false);
    setSelectedCampaign(null);
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
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Compras Colectivas' }]}
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
            textAlign: 'center',
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
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : campaignsData?.data?.campaigns?.length === 0 ? (
          <Card sx={{ textAlign: 'center', p: 6 }}>
            <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No hay compras colectivas activas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Las compras colectivas aparecerán aquí cuando los proveedores las publiquen
            </Typography>
            <Button variant="contained" onClick={() => navigate('/explorar-productos')}>
              Explorar Productos
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {campaignsData?.data?.campaigns?.map((campaign) => (
              <Grid item xs={12} sm={6} md={4} key={campaign.id_campana}>
                <CollectivePurchaseCard
                  campaign={campaign}
                  onJoinPurchase={handleJoinPurchase}
                  currentUserId={user?.data?.idUsuario}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Join Campaign Modal */}
      {selectedCampaign && (
        <JoinCampaignModal
          open={joinModalOpen}
          onClose={handleJoinModalClose}
          campaign={selectedCampaign}
          onSuccess={(quantity: number) => {
            // Track campaign join in analytics
            trackCampaignJoin(
              selectedCampaign.id_campana,
              selectedCampaign.id_producto,
              selectedCampaign.producto?.nombre_producto || 'Producto sin nombre',
              quantity,
              Number(selectedCampaign.precio_objetivo),
            );
            // Refresh campaigns data
            // queryClient.invalidateQueries(['collective-campaigns']);
          }}
        />
      )}
    </Box>
  );
};

export default ComprasColectivas;

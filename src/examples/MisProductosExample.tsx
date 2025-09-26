import { DashboardHeader, MobileActionBar } from '@/components';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MisProductosExample = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/proveedor-dashboard');
  };

  const handleAddProduct = () => {
    navigate('/agregar-producto');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Reusable Header */}
        <DashboardHeader
          title="Mis Productos"
          description="Gestiona tu catálogo de productos y mantén tu inventario actualizado"
          icon={<ShoppingCartIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: handleBackToDashboard,
            },
            {
              label: 'Mis Productos',
            },
          ]}
          onBack={handleBackToDashboard}
          actions={
            <>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleToggleFilters}
                sx={{
                  color: 'primary.contrastText',
                  borderColor: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
                    borderColor: 'primary.contrastText',
                  },
                }}
              >
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                sx={{
                  bgcolor: 'primary.contrastText',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.9),
                  },
                }}
              >
                Agregar Producto
              </Button>
            </>
          }
        />

        {/* Mobile Action Bar */}
        {isMobile && (
          <MobileActionBar>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleToggleFilters}
                size="large"
                sx={{ flex: 1 }}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                size="large"
                sx={{ flex: 1, bgcolor: '#4CAF4F' }}
              >
                Agregar
              </Button>
            </Box>
          </MobileActionBar>
        )}

        {/* Page Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productos Activos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esta sección mostraría la lista de productos activos del proveedor. El header y
                  las acciones móviles están completamente abstraídos y pueden reutilizarse en
                  cualquier otra sección del dashboard.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MisProductosExample;

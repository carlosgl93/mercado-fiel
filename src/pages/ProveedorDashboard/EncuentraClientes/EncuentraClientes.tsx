import { DashboardHeader } from '@/components';
import { Search as SearchIcon } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const EncuentraClientes = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/proveedor-dashboard');
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
        <DashboardHeader
          title="Encuentra Clientes"
          description="Encuentra personas que necesitan tus servicios"
          icon={<SearchIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: handleBackToDashboard,
            },
            {
              label: 'Encuentra Clientes',
            },
          ]}
          onBack={handleBackToDashboard}
        />

        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Esta sección está en desarrollo.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Próximamente podrás encontrar clientes que necesitan tus servicios.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

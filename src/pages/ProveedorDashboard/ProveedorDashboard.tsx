import { DashboardHeader } from '@/components';
import { DashboardTile } from '@/components/DashboardTile';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { Box, Container, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Wrapper } from './StyledPrestadorDashboardComponents';
import { useProveedorDashboard } from './usePrestadorDashboard';

export const ProveedorDashboard = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const { shouldDisablePublicarProductos, shouldDisableVentas } = useProveedorDashboard();

  const handleBackToHome = () => {
    navigate('/');
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
          title="Dashboard de Proveedor"
          description="Gestiona tu negocio, productos y clientes desde un solo lugar"
          icon={<DashboardIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Inicio',
              onClick: handleBackToHome,
            },
            {
              label: 'Dashboard',
            },
          ]}
          onBack={handleBackToHome}
        />

        <Wrapper sx={wrapperSx}>
          <DashboardTile
            goToPath="/proveedor-perfil"
            title="Mi perfil"
            subTitle="Actualiza tu información de negocio"
            isMobile={isMobile}
            text="Mantén actualizada la información de tu negocio, horarios, áreas de servicio y datos de contacto para que los clientes te encuentren fácilmente."
            ctaText="Actualizar perfil"
          />
          <DashboardTile
            goToPath="/mis-productos"
            title="Mis productos"
            subTitle="Gestiona tu catálogo de productos"
            isMobile={isMobile}
            text="Agrega, edita y administra tus productos. Define precios, inventario, descripciones e imágenes para atraer más clientes."
            ctaText="Gestionar productos"
            // ctaDisabled={shouldDisablePublicarProductos}
            // disabledText="Completa tu perfil primero"
          />
          <DashboardTile
            goToPath="/compras-colectivas"
            title="Campañas colectivas"
            subTitle="Crea campañas de compra grupal"
            isMobile={isMobile}
            text="Ofrece descuentos por volumen creando campañas donde los usuarios se unen para alcanzar mejores precios."
            ctaText="Crear campaña"
          />
          <DashboardTile
            goToPath="/pedidos-ventas"
            title="Pedidos y ventas"
            subTitle="Administra tus ventas y pedidos"
            isMobile={isMobile}
            text="Revisa los pedidos recibidos, gestiona el estado de las entregas y mantén un historial de tus ventas."
            ctaText="Ver pedidos"
            ctaDisabled={shouldDisableVentas}
            disabledText="No tienes productos activos"
          />
          <DashboardTile
            goToPath="/proveedor-inbox"
            title="Mensajes"
            subTitle="Comunícate con tus clientes"
            isMobile={isMobile}
            text="Responde consultas de clientes, negocia precios y mantén una comunicación fluida para cerrar más ventas."
            ctaText="Ver mensajes"
          />
          <DashboardTile
            goToPath="/estadisticas-ventas"
            title="Estadísticas"
            subTitle="Analiza el rendimiento de tu negocio"
            isMobile={isMobile}
            text="Revisa métricas de ventas, productos más populares, ingresos y tendencias para optimizar tu estrategia."
            ctaText="Ver estadísticas"
          />
        </Wrapper>
      </Container>
    </Box>
  );
};

const wrapperSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: '1fr 1fr',
    md: '1fr 1fr 1fr',
    lg: '1fr 1fr 1fr',
  },
  gridTemplateRows: {
    xs: 'auto',
    sm: 'auto',
    md: 'auto',
    lg: 'auto',
  },
  gap: '1rem',
  p: '1rem',
  borderRadius: '1rem',
  minHeight: '75vh',
  width: '100%',
};

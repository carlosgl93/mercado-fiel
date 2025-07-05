import { Box, useMediaQuery } from '@mui/material';
import { DashboardTile } from '@/components/DashboardTile';

export const UsuarioDashboard = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr',
        },
        gridTemplateRows: {
          xs: '1fr 1fr 1fr',
          sm: '1fr 1fr 1fr',
          md: '0.5fr',
          lg: '0.5fr',
        },
        gap: '1rem',
        p: '1rem',
        borderRadius: '1rem',
        minHeight: '75vh',
      }}
    >
      <DashboardTile
        goToPath="/perfil-usuario"
        title="Actualizar Perfil"
        subTitle="Actualiza tu información personal y de contacto"
        isMobile={isMobile}
        text="Actualiza tu información personal y de contacto."
        ctaText="Actualizar perfil"
      />
      <DashboardTile
        goToPath="/resultados"
        title="Encuentra apoyo"
        subTitle="Explora los prestadores disponibles"
        isMobile={isMobile}
        text="Filtra por comuna, tipo de servicio y especialidad, luego chatea con los prestadores acerca de los servicios que necesitas."
        ctaText="Buscar prestadores"
      />
      <DashboardTile
        goToPath="/mis-apoyos"
        title="Mis apoyos"
        subTitle="Administra tus solicitudes de apoyo"
        isMobile={isMobile}
        text="Hazte visible para que los prestadores te encuentren a tí."
        ctaText="Administrar apoyos"
      />
      <DashboardTile
        goToPath="/usuario-inbox"
        title="Inbox"
        subTitle="Revisa tus mensajes"
        isMobile={isMobile}
        text="Chatea con los prestadores"
        ctaText="Ver inbox"
      />
      <DashboardTile
        goToPath="/sesiones"
        title="Sesiones"
        subTitle="Revisa tus sesiones"
        isMobile={isMobile}
        text="Puedes obtener información de tus sesiones pasadas y futuras"
        ctaText="Ver sesiones"
      />
    </Box>
  );
};

import { DashboardTile } from '@/components/DashboardTile';
import { Box, useMediaQuery } from '@mui/material';

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
          xs: 'auto',
          sm: 'auto',
          md: 'auto',
          lg: 'auto',
        },
        gap: '1rem',
        p: '1rem',
        borderRadius: '1rem',
        minHeight: '75vh',
      }}
    >
      <DashboardTile
        goToPath="/perfil-usuario"
        title="Mi Perfil"
        subTitle="Actualiza tu información personal"
        isMobile={isMobile}
        text="Mantén actualizada tu información de contacto, direcciones de entrega y preferencias de compra."
        ctaText="Actualizar perfil"
      />
      <DashboardTile
        goToPath="/explorar-productos"
        title="Explorar Productos"
        subTitle="Descubre productos de proveedores locales"
        isMobile={isMobile}
        text="Navega por el catálogo completo de productos, filtra por categoría, precio y ubicación para encontrar lo que necesitas."
        ctaText="Ver productos"
      />
      <DashboardTile
        goToPath="/proveedores"
        title="Buscar Proveedores"
        subTitle="Encuentra proveedores cerca de ti"
        isMobile={isMobile}
        text="Conecta directamente con proveedores locales, revisa sus perfiles y productos disponibles."
        ctaText="Buscar proveedores"
      />
      <DashboardTile
        goToPath="/mi-carrito"
        title="Mi Carrito"
        subTitle="Administra tus productos seleccionados"
        isMobile={isMobile}
        text="Revisa los productos que has agregado, ajusta cantidades y procede al checkout cuando estés listo."
        ctaText="Ver carrito"
      />
      <DashboardTile
        goToPath="/mis-pedidos"
        title="Mis Pedidos"
        subTitle="Rastrea tus compras"
        isMobile={isMobile}
        text="Revisa el estado de tus pedidos, historial de compras y gestiona devoluciones o reclamos."
        ctaText="Ver pedidos"
      />
      <DashboardTile
        goToPath="/compras-colectivas"
        title="Compras Colectivas"
        subTitle="Únete a compras grupales"
        isMobile={isMobile}
        text="Participa en campañas de compra colectiva para obtener mejores precios al comprar en grupo."
        ctaText="Ver campañas"
      />
      <DashboardTile
        goToPath="/usuario-inbox"
        title="Mensajes"
        subTitle="Comunícate con proveedores"
        isMobile={isMobile}
        text="Chatea con proveedores para hacer consultas, negociar precios o coordinar entregas."
        ctaText="Ver mensajes"
      />
      <DashboardTile
        goToPath="/lista-deseos"
        title="Lista de Deseos"
        subTitle="Guarda productos para después"
        isMobile={isMobile}
        text="Mantén una lista de productos que te interesan y recibe notificaciones sobre ofertas y disponibilidad."
        ctaText="Ver lista"
      />
    </Box>
  );
};

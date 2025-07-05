import { Wrapper } from './StyledPrestadorDashboardComponents';
import { usePrestadorDashboard } from './usePrestadorDashboard';
import { useMediaQuery } from '@mui/material';
import { DashboardTile } from '@/components/DashboardTile';

export const PrestadorDashboard = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { shouldDisableEncuentraClientes } = usePrestadorDashboard();

  return (
    <Wrapper sx={wrapperSx}>
      <DashboardTile
        goToPath="/construir-perfil"
        title="Construyamos tu perfil"
        subTitle="Construye un perfil ganador"
        isMobile={isMobile}
        text="Destaca tus habilidades y experiencia. Establece valores competitivos y disponibilidad. Resalta para los clientes al agregar tu experiencia e intereses."
        ctaText="Construir perfil"
      />
      <DashboardTile
        goToPath="/encuentra-clientes"
        title="Encuentra clientes"
        subTitle="Aquí puedes ver quien está buscando tus servicios"
        isMobile={isMobile}
        text="Filtra por comuna, tipo de servicio y especialidad, luego chatea con los prestadores acerca de los servicios que necesitas."
        ctaText="Buscar clientes"
        ctaDisabled={shouldDisableEncuentraClientes}
        disabledText="Completa tu perfil"
      />
      <DashboardTile
        goToPath="/prestador-inbox"
        title="Inbox"
        subTitle="Revisa tus mensajes"
        isMobile={isMobile}
        text="Chatea con los usuarios"
        ctaText="Ver inbox"
      />
      <DashboardTile
        goToPath="/sesiones"
        title="Sesiones"
        subTitle="Organiza, chatea y confirma tus sesiones aquí"
        isMobile={isMobile}
        text="Revisa fechas, horarios y clientes. Chatea con tus clientes. Confirma la realización de la sesión para recibir el pago."
        ctaText="Ver sesiones"
      />
    </Wrapper>
  );
};

const wrapperSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: '1fr 1fr',
    md: '1fr 1fr',
    lg: '1fr 1fr 1fr',
  },
  gridTemplateRows: {
    xs: 'auto',
    sm: '1fr 1fr 1fr',
    md: '0.5fr 0.5fr',
    lg: '0.5fr 0.5fr',
  },
  gap: '1rem',
  p: '1rem',
  borderRadius: '1rem',
  minHeight: '75vh',
  width: '100%',
};

import BackButton from '@/components/BackButton';
import {
  BackButtonContainer,
  Container,
  StyledTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import { ServicioController } from './ServicioController';
import { CreateServicio } from './CreateServicio';
import Loading from '@/components/Loading';
import { ListServicios } from './ListServicios';

export const Servicio = () => {
  const { isCreatingServicio, prestadorCreatedServiciosLoading, saveServicioLoading } =
    ServicioController();

  if (prestadorCreatedServiciosLoading || saveServicioLoading) return <Loading />;

  return (
    <Wrapper
      sx={{
        justifyContent: 'start',
      }}
    >
      <BackButtonContainer>
        <BackButton displayText to="/construir-perfil" />
      </BackButtonContainer>
      <StyledTitle>Servicios</StyledTitle>
      <Container
        sx={{
          alignItems: 'start',
          justifyContent: 'start',
        }}
      >
        {isCreatingServicio ? <CreateServicio /> : <ListServicios />}
      </Container>
    </Wrapper>
  );
};

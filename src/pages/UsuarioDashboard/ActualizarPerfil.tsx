import { Text } from '@/components/StyledComponents';
import { useNavigate } from 'react-router-dom';
import { ButtonCTA, DashboardTileContainer, StyledTitle, SubTitle } from './StyledComponents';

export const ActualizarPerfil = () => {
  const router = useNavigate();

  const handleGoToProfile = () => {
    router(`/perfil-usuario`);
  };

  return (
    <DashboardTileContainer>
      <StyledTitle>Actualizar perfil</StyledTitle>
      <SubTitle>Agrega o actualiza tu información.</SubTitle>
      <Text>
        Tus datos, nombre, apellido, dirección, teléfono, email. Todo lo que necesitas para que los
        prestadores te puedan brindar el mejor servicio.
      </Text>
      <ButtonCTA variant="contained" onClick={handleGoToProfile}>
        Actualizar perfil
      </ButtonCTA>
    </DashboardTileContainer>
  );
};

import { Text } from '@/components/StyledComponents';
import { useNavigate } from 'react-router-dom';
import { ButtonCTA, DashboardTileContainer, StyledTitle, SubTitle } from './StyledComponents';

export const SesionesDashboardTile = () => {
  const router = useNavigate();

  const handleBuscarPrestadores = () => {
    router('/sesiones');
  };

  return (
    <DashboardTileContainer>
      <StyledTitle>Sesiones</StyledTitle>
      <SubTitle>Revisa tus sesiones</SubTitle>
      <Text>Puedes obtener información de tus sesiones pasadas y futuras</Text>
      <ButtonCTA variant="contained" onClick={handleBuscarPrestadores}>
        Ver sesiones
      </ButtonCTA>
    </DashboardTileContainer>
  );
};

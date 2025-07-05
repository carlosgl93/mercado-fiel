import { Text } from '@/components/StyledComponents';
import { useNavigate } from 'react-router-dom';
import { ButtonCTA, DashboardTileContainer, StyledTitle, SubTitle } from './StyledComponents';

export const EncuentraApoyo = () => {
  const router = useNavigate();

  const handleBuscarPrestadores = () => {
    router('/resultados');
  };

  return (
    <DashboardTileContainer>
      <StyledTitle>Encuentra apoyo</StyledTitle>
      <SubTitle>Explora los prestadores disponibles</SubTitle>
      <Text>
        Filtra por comuna, tipo de servicio y especialidad, luego chatea con los prestadores acerca
        de los servicios que necesitas.
      </Text>
      <ButtonCTA variant="contained" onClick={handleBuscarPrestadores}>
        Buscar prestadores
      </ButtonCTA>
    </DashboardTileContainer>
  );
};

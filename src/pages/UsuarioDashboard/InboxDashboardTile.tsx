import { useNavigate } from 'react-router-dom';
import { ButtonCTA, DashboardTileContainer, StyledTitle, SubTitle } from './StyledComponents';
import { Text } from '@/components/StyledComponents';

export const InboxDashboardTile = () => {
  const router = useNavigate();

  return (
    <DashboardTileContainer>
      <StyledTitle>Inbox</StyledTitle>
      <SubTitle>Revisa tus mensajes</SubTitle>
      <Text>Chatea con los prestadores</Text>
      <ButtonCTA variant="contained" onClick={() => router('/usuario-inbox')}>
        Ver inbox
      </ButtonCTA>
    </DashboardTileContainer>
  );
};

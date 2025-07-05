import { useNavigate } from 'react-router-dom';
import {
  ButtonCTA,
  DashboardTileContainer,
  StyledTitle,
  SubTitle,
} from '../../UsuarioDashboard/StyledComponents';
import { useAuthNew } from '@/hooks';
import { IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FlexBox } from '@/components/styled';
import { Text } from '@/components/StyledComponents';

export const AdministrarApoyosTile = () => {
  const { user } = useAuthNew();
  const router = useNavigate();

  const handleGoToMisApoyos = () => {
    router(`/mis-apoyos`);
  };

  return (
    <DashboardTileContainer>
      <StyledTitle>Mis apoyos</StyledTitle>
      <SubTitle>Administra tus solicitudes de apoyo</SubTitle>
      <Text>Hazte visible para que los prestadores te encuentren a tí.</Text>
      <FlexBox>
        <ButtonCTA
          variant="contained"
          onClick={handleGoToMisApoyos}
          disabled={!user?.profileImageUrl}
        >
          Administrar apoyos
        </ButtonCTA>
        {!user?.profileImageUrl && (
          <Tooltip
            title="Completa tu perfil para poder publicar apoyo"
            enterTouchDelay={0}
            sx={{
              ':hover': {
                backgroundColor: 'transparent',
              },
            }}
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -25],
                    },
                  },
                ],
              },
            }}
          >
            <IconButton>
              <HelpOutlineIcon
                sx={{
                  color: 'secondary.contrastText',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </FlexBox>
    </DashboardTileContainer>
  );
};

import { Text } from '@/components/StyledComponents';
import { useNavigate } from 'react-router-dom';
import {
  ButtonCTA,
  DashboardTileContainer,
  StyledTitle,
  SubTitle,
} from '../pages/UsuarioDashboard/StyledComponents';
import { IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type DashboardTileProps = {
  goToPath: string;
  title: string;
  subTitle: string;
  isMobile: boolean;
  text: string;
  ctaText: string;
  ctaDisabled?: boolean;
  disabledText?: string;
};

export const DashboardTile = ({
  goToPath,
  title,
  subTitle,
  isMobile,
  text,
  ctaText,
  ctaDisabled,
  disabledText,
}: DashboardTileProps) => {
  const router = useNavigate();

  const handleGoTo = () => {
    router(goToPath);
  };

  return (
    <DashboardTileContainer>
      <StyledTitle>{title}</StyledTitle>
      <SubTitle
        sx={{
          fontSize: isMobile ? '1rem' : '1.375rem',
        }}
      >
        {subTitle}
      </SubTitle>
      {!isMobile && <Text>{text}</Text>}

      <ButtonCTA variant="contained" onClick={handleGoTo} disabled={ctaDisabled}>
        {ctaText}
      </ButtonCTA>
      {ctaDisabled && disabledText && (
        <Tooltip
          title={disabledText}
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
    </DashboardTileContainer>
  );
};

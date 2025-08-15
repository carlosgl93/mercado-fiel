import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { ButtonCTA } from '../../pages/UsuarioDashboard/StyledComponents';
import { ImageSliderText } from '../ImageSlider';
import { FlexBox } from '../styled';

export const UserSearchesForCTAs = () => {
  const navigate = useNavigate();
  const { handleSelectLookingFor } = useUserLookingFor();

  const handleSelectUserLookingFor = (type: UserLookingFor) => {
    handleSelectLookingFor(type);
    navigate('/beneficios');
  };

  return (
    <Box>
      <FlexBox
        justifyContent={'space-evenly'}
        mr={4}
        sx={{
          gap: {
            xs: 0,
            sm: 8,
            md: 12,
            lg: 16,
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <ButtonCTA
            variant="contained"
            onClick={() => handleSelectUserLookingFor(UserLookingFor.SUPPLIERS)}
          >
            Soy cliente
          </ButtonCTA>
          <ImageSliderText>Encuentra ofertas exclusivas y ahorra</ImageSliderText>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <ButtonCTA
            variant="contained"
            onClick={() => handleSelectUserLookingFor(UserLookingFor.CUSTOMERS)}
            sx={{
              // lineHeight: 1.2,
              width: { xs: '110%', sm: 'fit-content' },
            }}
          >
            Soy proveedor
          </ButtonCTA>
          <ImageSliderText>Llega a más clientes y vende más</ImageSliderText>
        </Box>
      </FlexBox>
    </Box>
  );
};

import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { ButtonCTA } from '../../pages/UsuarioDashboard/StyledComponents';
import { FlexBox } from '../styled';

export const UserSearchesForCTAs = () => {
  const navigate = useNavigate();
  const { handleSelectLookingFor } = useUserLookingFor();

  const handleSelectUserLookingFor = (type: UserLookingFor) => {
    handleSelectLookingFor(type);
    navigate('/resultados');
  };

  return (
    <Box>
      <FlexBox justifyContent={'space-evenly'}>
        <ButtonCTA
          variant="contained"
          onClick={() => handleSelectUserLookingFor(UserLookingFor.SUPPLIERS)}
        >
          Proveedores
        </ButtonCTA>
        <ButtonCTA
          variant="contained"
          onClick={() => handleSelectUserLookingFor(UserLookingFor.SUPPLIERS)}
        >
          Clientes
        </ButtonCTA>
      </FlexBox>
    </Box>
  );
};

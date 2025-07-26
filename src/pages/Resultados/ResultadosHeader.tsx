import { Box, styled } from '@mui/material';
import { useUserLookingFor } from '../../hooks';
import { StyledTitle } from '../UsuarioDashboard/StyledComponents';

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  marginTop: '0rem',
  marginBottom: '1rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '1rem',
  width: '100%',
}));

export const ResultadosHeader = () => {
  const { lookingFor } = useUserLookingFor();

  return (
    <Wrapper>
      <StyledTitle>
        Buscando {lookingFor ? lookingFor.toLowerCase() : 'proveedores y clientes'}
      </StyledTitle>
    </Wrapper>
  );
};

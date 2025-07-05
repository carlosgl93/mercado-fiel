import { Title } from '@/components/StyledComponents';
import { Box, styled } from '@mui/material';

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  width: '100%',
}));

export const EncuentraClientesHeader = () => {
  return (
    <Wrapper>
      <Title sx={{ fontSize: '2rem', p: '1rem' }}>Buscar clientes</Title>
    </Wrapper>
  );
};

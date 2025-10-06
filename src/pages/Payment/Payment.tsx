import { Title } from '@/components/StyledComponents';
import { Box, Card, CardContent, styled } from '@mui/material';

export const Payment = () => {
  return (
    <StyledBox>
      <StyledCard variant="outlined">
        <CardContent>
          <Title>Hubo un error al cargar esta informacion, por favor intentalo nuevamente</Title>
        </CardContent>
      </StyledCard>
    </StyledBox>
  );
};

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  padding: '1rem',
  minHeight: '75vh',
}));

const StyledCard = styled(Card)(() => ({
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  padding: '2rem 1.2rem',
  justifyContent: 'space-between',
  textAlign: 'center',
  alignItems: 'center',
}));

export const StyledTitle = styled(Title)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2.6rem',
}));

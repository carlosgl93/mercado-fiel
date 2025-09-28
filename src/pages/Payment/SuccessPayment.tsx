import { Text, Title } from '@/components/StyledComponents';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Box, Button, styled, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type FailedPaymentProps = {
  theme?: Theme;
};

const StyledTitle = styled(Title)(({ theme }) => ({
  fontSize: '2rem',
  color: theme.palette.primary.main,
  marginBottom: '1rem',
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem',
});

export const SuccessPayment = ({ theme }: FailedPaymentProps) => {
  const navigate = useNavigate();

  return (
    <>
      <CheckCircleOutlinedIcon
        sx={{
          fontSize: '3rem',
          color: theme?.palette.secondary.contrastText,
        }}
      />
      <StyledTitle>Pago exitoso</StyledTitle>

      <Text>Fechas: </Text>

      <Text>
        Por favor, revisa tu correo electrónico para más detalles e instrucciones adicionales.
      </Text>
      <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: '1rem' }}
          onClick={() => navigate('/sesiones')}
        >
          Ver detalles de la cita
        </Button>
      </ButtonContainer>
    </>
  );
};

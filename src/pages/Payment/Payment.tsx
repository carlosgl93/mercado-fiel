import { useSearchParams } from 'react-router-dom';
import { Title } from '@/components/StyledComponents';
import { SuccessPayment } from './SuccessPayment';
import Loading from '@/components/Loading';
import { Box, Card, CardContent, Container, styled, useTheme } from '@mui/material';
import { FailedPayment } from './FailedPayment';
import { useAppointments } from '@/hooks/useAppointments';

export const Payment = () => {
  const [params] = useSearchParams();
  const theme = useTheme();
  const {
    multipleAppointments,
    isLoadingMultipleAppointments: isLoadingAppointment,
    multipleAppointmentsError: appointmentError,
  } = useAppointments(params.get('appointmentsIds') || '');

  if (
    isLoadingAppointment
    // || isLoadingPaykuPayment
  )
    return <Loading />;

  if (
    appointmentError
    // || paykuPaymentError
  )
    return (
      <StyledBox>
        <StyledCard variant="outlined">
          <CardContent>
            <Title>Hubo un error al cargar esta informacion, por favor intentalo nuevamente</Title>
          </CardContent>
        </StyledCard>
      </StyledBox>
    );

  if (!multipleAppointments || multipleAppointments.length === 0)
    return (
      <Container>
        <Title>No se encontró ninguna sesión con estos detalles</Title>
      </Container>
    );

  console.log({ multipleAppointments });
  return (
    <StyledBox>
      <StyledCard variant="outlined">
        <CardContent>
          {multipleAppointments.some((appointment) => appointment.isPaid === 'Pagado') ? (
            <SuccessPayment appointments={multipleAppointments} theme={theme} />
          ) : (
            <FailedPayment appointments={multipleAppointments} theme={theme} />
          )}
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

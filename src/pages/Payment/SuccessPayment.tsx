import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Text, Title } from '@/components/StyledComponents';
import { Appointment } from '@/api/appointments';
import { Box, Button, styled, Theme } from '@mui/material';
import { formatDate } from '@/utils/formatDate';
import { useNavigate } from 'react-router-dom';

type FailedPaymentProps = {
  appointments: Appointment[];
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

export const SuccessPayment = ({ appointments, theme }: FailedPaymentProps) => {
  const navigate = useNavigate();
  const appointment = appointments[0];
  const appDateFormatted = formatDate(appointment.scheduledDate, true);
  const sameDayAppointmetNode = (
    <Text data-testid="same-day-app">
      Recuerda que tu siguiente sesión es hoy a las {appointment.scheduledTime}.
    </Text>
  );
  const differentDayAppointmentNode = (
    <Text data-testid="future-app">
      Recuerda que tu siguiente sesión será el día {appDateFormatted} a las{' '}
      {appointment.scheduledTime}.
    </Text>
  );
  return (
    <>
      <CheckCircleOutlinedIcon
        sx={{
          fontSize: '3rem',
          color: theme?.palette.secondary.contrastText,
        }}
      />
      <StyledTitle>Pago exitoso</StyledTitle>
      <Text>
        <b>
          {appointment.customer.firstname}, {appointments.length > 1 ? 'tus sesiones' : 'tu sesión'}{' '}
          con {appointment.provider.firstname}{' '}
          {appointments.length > 1 ? 'fueron pagadas ' : 'fue pagada '} exitosamente.
        </b>
      </Text>
      <Text>
        Si agendaste más sesiones sin pagarlas, estas quedaron agendadas y se te solicitara
        confirmarlas en el futuro.
      </Text>
      {appDateFormatted === 'Hoy' ? sameDayAppointmetNode : differentDayAppointmentNode}
      <Text>
        Servicio: <b>{appointment.servicio.name}</b>
      </Text>
      <Text>
        Proveedor:{' '}
        <b>
          {appointment.provider.firstname} {appointment.provider.lastname}
        </b>
      </Text>
      <Text>Fechas: </Text>
      <Text
        sx={{
          textJustify: 'left',
        }}
      >
        {appointments
          .map((app) => formatDate(app.scheduledDate, true) + ' a las ' + app.scheduledTime)
          .join(' - ')}
      </Text>
      <Text>
        Puedes seguir chateando con {appointment.provider.firstname} en la sección "Mis sesiones" de
        tu perfil.
      </Text>
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

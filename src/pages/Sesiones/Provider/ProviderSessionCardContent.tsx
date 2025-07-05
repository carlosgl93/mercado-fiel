import { ProviderAppointmentController } from './ProviderAppointmentController';
import { Box, Button, CardContent } from '@mui/material';
import { Appointment } from '@/api/appointments';
import PaymentIcon from '@mui/icons-material/Payment';
import { Text } from '@/components/StyledComponents';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import { FlexBox } from '@/components/styled';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { useSetRecoilState } from 'recoil';
import { chatState } from '@/store/chat/chatStore';

type SessionCardContentProps = {
  appointment: Appointment;
};

export const ProviderSessionCardContent = ({ appointment }: SessionCardContentProps) => {
  const navigate = useNavigate();
  const setChatState = useSetRecoilState(chatState);
  const { customer, servicio, isPaid, status } = appointment;
  const { firstname, lastname, email } = customer;
  const { isPast, appointmentDoneLoading, handleAppointmentDone } =
    ProviderAppointmentController(appointment);

  if (appointmentDoneLoading) return <Loading />;

  return (
    <CardContent>
      <FlexBoxAlignCenter>
        <PersonIcon
          sx={{
            color: 'primary.main',
          }}
        />
        <Text variant="body2" color="textSecondary">
          {firstname && lastname ? `${firstname} ${lastname}` : email}
        </Text>
      </FlexBoxAlignCenter>
      <FlexBoxAlignCenter>
        <WorkIcon
          sx={{
            color: 'primary.main',
          }}
        />
        <Text variant="body2" color="textSecondary">
          {servicio?.name}
        </Text>
      </FlexBoxAlignCenter>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <FlexBoxAlignCenter>
          <PaymentIcon
            sx={{
              color: isPaid ? 'primary.main' : 'secondary.contrastText',
            }}
          />
          <Text
            variant="body2"
            color="textSecondary"
            justifyContent="left"
            sx={{
              textAlign: 'start',
            }}
          >
            {status}
          </Text>
        </FlexBoxAlignCenter>
        {!isPast && (
          <Button
            startIcon={<ChatOutlinedIcon />}
            variant="contained"
            onClick={() => {
              setChatState({
                providerId: appointment?.provider?.id,
                userId: appointment?.customer?.id,
                providerName: appointment.provider.firstname ?? '',
                username: appointment.customer.firstname ?? '',
                id: '',
                messages: [],
              });
              navigate('/prestador-chat', {
                state: {
                  providerId: appointment?.provider?.id,
                  userId: appointment?.customer?.id,
                },
              });
            }}
          >
            Chat
          </Button>
        )}
        {isPast && (status === 'Agendada' || status === 'Pagada') && (
          <Box>
            <Button variant="contained" onClick={handleAppointmentDone}>
              Realizada
            </Button>
          </Box>
        )}
      </Box>
    </CardContent>
  );
};

type FlexBoxAlignCenterProps = {
  children: React.ReactNode;
};

/* eslint-disable react/prop-types */
const FlexBoxAlignCenter: React.FC<FlexBoxAlignCenterProps> = ({ children }) => {
  return (
    <FlexBox
      sx={{
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {children}
    </FlexBox>
  );
};

import { Appointment } from '../../../api/appointments/scheduleAppointmentMutation';
import { Card, CardHeader } from '@mui/material';
import { formatDate } from '@/utils/formatDate';
import { ProviderSessionCardContent } from './ProviderSessionCardContent';

type SessionCardProps = {
  appointment: Appointment;
};

export const ProviderSessionCard = ({ appointment }: SessionCardProps) => {
  const { scheduledDate, scheduledTime } = appointment;
  // const [chat, setChat] = useRecoilState(chatState);
  // const navigate = useNavigate();

  // const handleContact = () => {
  //   setChat({
  //     ...chat,
  //     id: customer.id,
  //     username: `${customer.firstname} ${customer.lastname}`,
  //   });
  //   navigate('/prestador-chat');
  // };

  return (
    <Card sx={{ my: 2, borderRadius: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <CardHeader
        title={`${formatDate(scheduledDate, true)}`}
        subheader={`a las ${scheduledTime}`}
        titleTypographyProps={{
          variant: 'h5',
          color: 'secondary.contrastText',
          fontWeight: 'bold',
        }}
      />
      <ProviderSessionCardContent appointment={appointment} />
    </Card>
  );
};

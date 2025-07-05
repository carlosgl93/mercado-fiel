import { Appointment } from '../../../api/appointments/scheduleAppointmentMutation';
import { Card, CardHeader } from '@mui/material';
import { UserSessionCardContent } from './UserSessionCardContent';
import { formatDate } from '@/utils/formatDate';

type SessionCardProps = {
  appointment: Appointment;
};

export const UserSessionCard = ({ appointment }: SessionCardProps) => {
  const { scheduledDate, scheduledTime } = appointment;

  return (
    <Card
      sx={{
        width: '100%',
        my: 2,
        borderRadius: '1rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <CardHeader
        title={`${formatDate(scheduledDate, true)}`}
        subheader={`a las ${scheduledTime}`}
        titleTypographyProps={{
          variant: 'h6',
          color: 'secondary.contrastText',
          fontWeight: 'bold',
        }}
      />
      <UserSessionCardContent appointment={appointment} />
    </Card>
  );
};

import { sendEmailApi } from '@/api';
import { Appointment } from '@/api/appointments';
import { doneMutation } from '@/api/appointments/doneMutation';
import { notificationState } from '@/store/snackbar';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export function ProviderAppointmentController(appointment: Appointment) {
  const { provider, customer, scheduledDate, scheduledTime } = appointment;
  const setNotification = useSetRecoilState(notificationState);

  const client = useQueryClient();

  const isPast = useMemo(() => {
    const dateTime = scheduledDate + ' ' + scheduledTime;
    const sesionDate = typeof dateTime === 'string' ? dateTime : undefined;
    return dayjs().isAfter(dayjs(sesionDate));
  }, [scheduledDate, scheduledTime]);

  const { mutate: appointmentDoneMutation, isLoading: appointmentDoneLoading } = useMutation(
    doneMutation,
    {
      onSuccess() {
        setNotification({
          open: true,
          message: 'Sesión realizada.',
          severity: 'success',
        });
        client.invalidateQueries(['providerAppointments', appointment.provider.id]);
        // trigger email notification to the user, so he can confirm it
        sendEmailApi.post('/', {
          customerName: customer.firstname,
          providerName: provider.firstname,
          templateName: 'sesion-realizada.html',
          // serviceName: servicio.name,
          options: {
            from: 'Mercado Fiel <contacto@mercadofiel.cl>',
            to: customer.email,
            subject: 'Confirmación sesión realizada',
            text: `Sesión con ${provider.firstname} realizada, confirmar aquí`,
          },
        });
      },
      onError() {
        setNotification({
          open: true,
          message: 'Error al actualizar la sesión.',
          severity: 'error',
        });
      },
    },
  );

  const handleAppointmentDone = () => {
    // call api mutation for setting the status to "Realizada"
    if (appointment.id) {
      appointmentDoneMutation(appointment.id);
    }
  };

  return {
    isPast,
    handleAppointmentDone,
    appointmentDoneLoading,
  };
}

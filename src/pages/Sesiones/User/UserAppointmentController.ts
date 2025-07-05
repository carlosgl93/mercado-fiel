import { Appointment, confirmAppointmentDone, rateAppointment } from '@/api/appointments';
import { getPaykuTransaction } from '@/api/payments/payku/getPaykuTransaction';
import { db } from '@/firebase';
import { chatState } from '@/store/chat/chatStore';
import { notificationState } from '@/store/snackbar';
import dayjs from 'dayjs';
import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export function UserAppointmentController(appointment: Appointment) {
  const { provider, scheduledDate, scheduledTime, paykuId } = appointment;
  const setNotification = useSetRecoilState(notificationState);
  const navigate = useNavigate();
  const setChatState = useSetRecoilState(chatState);

  const isPast = useMemo(() => {
    const dateTime = scheduledDate + ' ' + scheduledTime;
    const sesionDate = typeof dateTime === 'string' ? dateTime : undefined;
    return dayjs().isAfter(dayjs(sesionDate));
  }, [scheduledDate, scheduledTime]);

  const client = useQueryClient();

  const { mutate: confirmAppointmentDoneMutation, isLoading: confirmAppointmentDoneLoading } =
    useMutation(confirmAppointmentDone, {
      onSuccess() {
        setNotification({
          open: true,
          message: 'Sesión realizada, gracias por confirmar.',
          severity: 'success',
        });
        client.invalidateQueries(['userAppointments', appointment.customer.id]);
      },
      onError() {
        setNotification({
          open: true,
          message: 'Error al confirmar la sesión.',
          severity: 'error',
        });
      },
    });

  const { mutate: rateAppointmentMutation, isLoading: rateAppointmentLoading } = useMutation(
    rateAppointment,
    {
      onSuccess() {
        setNotification({
          open: true,
          message: 'Sesión calificada.',
          severity: 'success',
        });
      },
      onError() {
        setNotification({
          open: true,
          message: 'Error al calificar la sesión.',
          severity: 'error',
        });
      },
    },
  );

  const handleConfirmAppointmentDone = () => {
    // call api mutation for setting the status to "Realizada"
    if (appointment.id) {
      confirmAppointmentDoneMutation(appointment.id);
    }
  };

  const handleRateAppointment = (rating: number, comment?: string) => {
    if (appointment.id && provider.id) {
      rateAppointmentMutation({
        providerId: provider.id,
        appointmentId: appointment.id,
        rating,
        comment: comment || '',
      });
    }
  };

  const handleChat = () => {
    setChatState({
      providerId: appointment?.provider?.id,
      userId: appointment?.customer?.id,
      providerName: appointment.provider.firstname ?? '',
      username: appointment.customer.firstname ?? '',
      id: '',
      messages: [],
    });
    navigate('/chat', {
      state: {
        providerId: appointment?.provider?.id,
        userId: appointment?.customer?.id,
      },
    });
  };

  const handlePayPending = async () => {
    if (!handlePayPending) {
      throw new Error('No payku ID associated with this transaction/appointment');
    }
    console.log('paykuId', paykuId);

    try {
      const paykuTransaction = await getPaykuTransaction(paykuId || '');
      console.log('paykuTransaction', paykuTransaction);
      if (paykuTransaction.status === 'Pagado') {
        setNotification({
          open: true,
          message: 'La transacción ya fue pagada',
          severity: 'info',
        });
        return;
      }

      if (!appointment.paykuPaymentURL) {
        setNotification({
          open: true,
          message: 'No existe la URL para pagar',
          severity: 'error',
        });
        return;
      }
      window.location.href = appointment.paykuPaymentURL;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching payku transaction');
    }
  };

  useEffect(() => {
    if (appointment.status === 'Agendada' && appointment.isPaid === false && appointment.id) {
      console.log('running delete appointment in case wrong schedule');
      const deleteAppointment = async () => {
        const docRef = doc(db, 'appointments', String(appointment.id));
        await deleteDoc(docRef);
      };
      deleteAppointment();
    }
  }, []);

  return {
    isPast,
    confirmAppointmentDoneLoading,
    rateAppointmentLoading,
    handleConfirmAppointmentDone,
    handleRateAppointment,
    handleChat,
    handlePayPending,
  };
}

import { getAppointmentByIdQuery } from '@/api/appointments';
import { getPaykuTransaction } from '@/api/payments/payku/getPaykuTransaction';
import { useQuery } from 'react-query';

export const useAppointment = (appointmentId: string | null) => {
  if (!appointmentId) {
    throw new Error('missing appointment ID');
  }

  const {
    data: appointment,
    isLoading: isLoadingAppointment,
    error: appointmentError,
  } = useQuery(['appointment', appointmentId], () => getAppointmentByIdQuery(appointmentId));

  const {
    data: paykuPayment,
    isLoading: isLoadingPaykuPayment,
    error: paykuPaymentError,
  } = useQuery(['paymentStatus', appointmentId], () => getPaykuTransaction(appointmentId));

  return {
    appointment,
    isLoadingAppointment,
    appointmentError,
    paykuPayment,
    isLoadingPaykuPayment,
    paykuPaymentError,
  };
};

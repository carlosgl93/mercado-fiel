import { useQuery } from 'react-query';
import { getPaykuTransaction } from '@/api/payments/payku/getPaykuTransaction';

export const useAppointment = (appointmentId: string | null) => {
  if (!appointmentId) {
    throw new Error('missing appointment ID');
  }

  const {
    data: paykuPayment,
    isLoading: isLoadingPaykuPayment,
    error: paykuPaymentError,
  } = useQuery(['paymentStatus', appointmentId], () => getPaykuTransaction(appointmentId));

  return {
    paykuPayment,
    isLoadingPaykuPayment,
    paykuPaymentError,
  };
};

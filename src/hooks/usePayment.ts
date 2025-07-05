import { getPaymentStatus } from '@/api/payments';
import { useQuery } from 'react-query';

export const usePayment = (appointmentId: string | null) => {
  const { data: payment, isLoading: isLoadingPayment } = useQuery(['payment', appointmentId], () =>
    getPaymentStatus(appointmentId),
  );

  return {
    payment,
    isLoadingPayment,
  };
};

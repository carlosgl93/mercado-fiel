import { getPayments } from '@/api/payments/getPayments';
import { useQuery } from 'react-query';

export const usePayments = () => {
  const { data: payments, isLoading: isLoadingPayments } = useQuery(['payments'], () =>
    getPayments(),
  );

  return { payments, isLoadingPayments };
};

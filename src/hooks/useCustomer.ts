import { getCustomer } from '@/api/users/getCustomer';
import { useQuery } from 'react-query';

export const useCustomer = (customerId: string) => {
  const {
    data: customer,
    isError,
    isLoading,
    error,
  } = useQuery(['customer', customerId], () => getCustomer(customerId), {
    enabled: !!customerId,
  });

  return {
    customer,
    isError,
    isLoading,
    error,
  };
};

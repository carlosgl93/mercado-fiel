import { useQuery } from 'react-query';
import { getCustomers } from '../api/customers/getCustomers';

export const useCustomers = (page: number, limit: number) => {
  const {
    data: customers,
    isLoading: isLoadingCustomers,
    error: customersError,
    isError: isCustomersError,
  } = useQuery(
    ['customers', page, limit],
    // The queryFn receives the queryKey as its first argument
    ({ queryKey }) => {
      const [, page, limit] = queryKey;
      return getCustomers(page as number, limit as number);
    },
    {
      keepPreviousData: true,
    },
  );

  return {
    customers,
    isLoadingCustomers,
    customersError,
    isCustomersError,
  };
};

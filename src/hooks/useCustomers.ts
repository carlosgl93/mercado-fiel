import { useQuery } from 'react-query';
import { getCustomers } from '../api/customers/getCustomers';
import { Comuna } from '../models';
import { Category } from './useCategories';
import { useResultFilters } from './useResultFilters';
import { UserLookingFor } from './useUserLookingFor';

export const useCustomers = (page: number, limit: number) => {
  const { selectedCategory, userLookingFor, comuna } = useResultFilters();

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    error: customersError,
    isError: isCustomersError,
  } = useQuery(
    ['customers', page, limit, comuna, selectedCategory],
    // The queryFn receives the queryKey as its first argument
    ({ queryKey }) => {
      const [, page, limit, comuna, selectedCategory] = queryKey;
      return getCustomers(
        page as number,
        limit as number,
        comuna as Comuna,
        selectedCategory as Category,
      );
    },
    {
      keepPreviousData: true,
      enabled: userLookingFor === UserLookingFor.CUSTOMERS,
    },
  );

  return {
    customers,
    isLoadingCustomers,
    customersError,
    isCustomersError,
  };
};

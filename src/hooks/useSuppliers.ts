import { useQuery } from 'react-query';
import { getSuppliers } from '../api';

export const useSuppliers = (page: number, limit: number) => {
  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    error: suppliersError,
    isError: isSuppliersError,
  } = useQuery(
    ['suppliers', page, limit],
    // The queryFn receives the queryKey as its first argument
    ({ queryKey }) => {
      const [, page, limit] = queryKey;
      return getSuppliers(page as number, limit as number);
    },
    {
      keepPreviousData: true,
    },
  );

  return {
    suppliers,
    isLoadingSuppliers,
    suppliersError,
    isSuppliersError,
  };
};

import { useQuery } from 'react-query';
import { getSuppliers } from '../api';
import { Comuna } from '../models';
import { Category } from './useCategories';
import { useResultFilters } from './useResultFilters';
import { UserLookingFor } from './useUserLookingFor';

export const useSuppliers = (page: number, limit: number) => {
  const { selectedCategory, userLookingFor, comuna } = useResultFilters();

  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    error: suppliersError,
    isError: isSuppliersError,
  } = useQuery(
    ['suppliers', page, limit, comuna, selectedCategory],
    // The queryFn receives the queryKey as its first argument
    ({ queryKey }) => {
      const [, page, limit, comuna, selectedCategory] = queryKey;
      return getSuppliers(
        page as number,
        limit as number,
        comuna as Comuna,
        selectedCategory as Category,
      );
    },
    {
      keepPreviousData: true,
      enabled: userLookingFor === UserLookingFor.SUPPLIERS,
    },
  );

  return {
    suppliers,
    isLoadingSuppliers,
    suppliersError,
    isSuppliersError,
  };
};

import { suppliersApi } from '@/api/suppliers';
import { usersApi } from '@/api/users';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

export interface SearchFilters {
  searchTerm: string;
  category: string;
  region: string;
  comuna: string;
}

export const useSearchLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for search type (0 = providers, 1 = clients)
  const [searchType, setSearchType] = useState(0);
  
  // State for filters
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    region: searchParams.get('region') || '',
    comuna: searchParams.get('comuna') || '',
  });

  // Debounce search term for better UX
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Create debounced filters for API calls
  const debouncedFilters = {
    ...filters,
    searchTerm: debouncedSearchTerm,
  };

  // Query for suppliers
  const {
    data: suppliersResponse,
    isLoading: isLoadingSuppliers,
    error: suppliersError,
  } = useQuery({
    queryKey: ['search', 'suppliers', debouncedFilters],
    queryFn: () => suppliersApi.searchSuppliers(debouncedFilters),
    enabled: searchType === 0,
  });

  // Query for clients
  const {
    data: clientsResponse,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useQuery({
    queryKey: ['search', 'clients', debouncedFilters],
    queryFn: () => usersApi.searchClients(debouncedFilters),
    enabled: searchType === 1,
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.searchTerm) params.set('q', debouncedFilters.searchTerm);
    if (debouncedFilters.category) params.set('category', debouncedFilters.category);
    if (debouncedFilters.region) params.set('region', debouncedFilters.region);
    if (debouncedFilters.comuna) params.set('comuna', debouncedFilters.comuna);
    
    setSearchParams(params);
  }, [debouncedFilters, setSearchParams]);

  const suppliers = suppliersResponse?.data || [];
  const clients = clientsResponse?.data || [];
  const isLoading = searchType === 0 ? isLoadingSuppliers : isLoadingClients;
  const error = searchType === 0 ? suppliersError : clientsError;

  const handleSearchTermChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleTabChange = (newSearchType: number) => {
    setSearchType(newSearchType);
  };

  return {
    searchType,
    filters,
    suppliers,
    clients,
    isLoading,
    error,
    handleSearchTermChange,
    handleFiltersChange,
    handleTabChange,
  };
};

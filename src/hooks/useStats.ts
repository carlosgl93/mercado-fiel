import {
  getPrestadoresCount,
  getProvidersPerComunaCount,
  getUsersCount,
  getUsersPerComunaCount,
} from '@/api/stats';
import { useQuery } from 'react-query';

export const useStats = () => {
  const {
    data: usersCount,
    isLoading: usersCountLoading,
    error: usersCountError,
  } = useQuery<number, Error>('usersCount', getUsersCount, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: prestadoresCount,
    isLoading: prestadoresCountLoading,
    error: prestadoresCountError,
  } = useQuery<number, Error>('prestadoresCount', getPrestadoresCount, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: providersPerComunaCount,
    isLoading: providersPerComunaCountLoading,
    error: providersPerComunaCountError,
  } = useQuery('providersPerComunaCount', getProvidersPerComunaCount, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: usersPerComunaCount,
    isLoading: usersPerComunaCountLoading,
    error: usersPerComunaCountError,
  } = useQuery('usersPerComunaCount', getUsersPerComunaCount, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    usersCount,
    prestadoresCount,
    usersCountLoading,
    prestadoresCountLoading,
    usersCountError,
    prestadoresCountError,
    providersPerComunaCount,
    providersPerComunaCountLoading,
    providersPerComunaCountError,
    usersPerComunaCount,
    usersPerComunaCountLoading,
    usersPerComunaCountError,
  };
};

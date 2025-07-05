import { useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Prestador } from '@/store/auth/prestador';
import { notificationState } from '@/store/snackbar';
import { getAllPrestadores, getPrestadores } from '@/api/prestadores';
import { getTotalPrestadoresQuery } from '@/api/prestadores/getTotalPrestadores';

export const useGetPrestadores = () => {
  const [{ servicio, comuna, especialidad }] = useRecibeApoyo();
  const setNotification = useSetRecoilState(notificationState);
  const [limit] = useState(1);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<Prestador> | null>(null);

  const {
    data: allPrestadores = [],
    isLoading: allPrestadoresLoading,
    isError: allPrestadoresError,
  } = useQuery<Prestador[]>(['allPrestadores'], () => getAllPrestadores());

  const {
    data: verifiedPrestadores,
    isLoading,
    isError,
  } = useQuery(
    ['prestadoresByComunaAndServicio', comuna, servicio, especialidad],
    () => getPrestadores(comuna, servicio, especialidad, lastDoc, limit),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess(data) {
        setLastDoc(data.lastDoc as QueryDocumentSnapshot<Prestador>);
      },
      onError(err) {
        console.error(err);
        setNotification({
          open: true,
          message: 'Hubo un error al cargar los prestadores',
          severity: 'error',
        });
      },
    },
  );

  const {
    data: infinitePrestadores,
    isLoading: infinitePrestadoresIsLoading,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['verifiedProvidersInfinite', comuna, servicio, especialidad],
    ({ pageParam = null }) => getPrestadores(comuna, servicio, especialidad, pageParam, limit),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      getPreviousPageParam: (firstPage) => firstPage.lastDoc,
      getNextPageParam: (lastPage) => lastPage.lastDoc,
    },
  );

  const { data: totalPrestadores, isLoading: isLoadingTotalPrestadores } = useQuery(
    'totalPrestadores',
    getTotalPrestadoresQuery,
    {},
  );

  useEffect(() => {
    const sentinel = document.querySelector('.bottomSentinel');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (sentinel) {
      observer.observe(sentinel);
    }
  }, []);

  return {
    verifiedPrestadores: verifiedPrestadores,
    infinitePrestadores: infinitePrestadores?.pages,
    infinitePrestadoresIsLoading,
    allPrestadores,
    allPrestadoresLoading,
    allPrestadoresError,
    totalPrestadores,
    isLoadingTotalPrestadores,
    isLoading,
    isError,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

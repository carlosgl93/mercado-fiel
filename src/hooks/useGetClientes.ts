import { User } from '@/store/auth/user';
import { useAuthNew } from './useAuthNew';
import { useCallback, useRef, useState } from 'react';
import { getTotalClientesQuery } from '@/api';
import { getClientes } from '@/api/clientes/getClientes';
import { useInfiniteQuery, useQuery } from 'react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export type UserPages =
  | {
      clientes: User[];
      lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData>;
    }[]
  | undefined;

export const useGetClientes = () => {
  const { prestador } = useAuthNew();
  const [limit] = useState(10);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(
    null,
  );

  const {
    data: infiniteClientes,
    isLoading: infiniteClientesIsLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getClientes', prestador?.comunas, prestador?.servicio, prestador?.especialidad],
    () =>
      getClientes(prestador?.comunas, prestador?.servicio, prestador?.especialidad, lastDoc, limit),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      getPreviousPageParam: (firstPage) => firstPage.lastDoc,
      getNextPageParam: (lastPage) => lastPage.lastDoc,
      onSuccess(data) {
        const lastPage = data.pages[data.pages.length - 1];
        setLastDoc(lastPage.lastDoc);
      },
    },
  );

  const { data: totalClientes, isLoading: isLoadingtotalClientes } = useQuery(
    'totalClientes',
    getTotalClientesQuery,
    {},
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const lastClientElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (infiniteClientesIsLoading || !hasNextPage || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          await fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [infiniteClientesIsLoading, hasNextPage, fetchNextPage, isFetchingNextPage],
  );

  return {
    infiniteClientes: infiniteClientes?.pages,
    infiniteClientesIsLoading,
    totalClientes,
    isLoadingtotalClientes,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    lastClientElementRef,
  };
};

import {
  deleteSupportRequest,
  getSupportRequests,
  getTotalSupportRequests,
  getUserSupportRequests,
} from '@/api/supportRequests';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuthNew } from './useAuthNew';
import { useState } from 'react';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const useSupportRequests = (userId?: string) => {
  const { prestador } = useAuthNew();
  const queryClient = useQueryClient();
  const [limit] = useState(10);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(
    null,
  );
  const {
    data: userSupportRequests,
    isLoading: isSupportRequestsLoading,
    isError: isSupportRequestsError,
  } = useQuery('userSupportRequests', () => getUserSupportRequests(userId!), {
    enabled: !!userId,
  });

  const {
    data: infiniteSupportRequests,
    isLoading: infiniteSupportRequestsIsLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getSupportRequests', prestador?.comunas, prestador?.servicio, prestador?.especialidad],
    () =>
      getSupportRequests(
        prestador!.comunas.map((c) => c.id),
        prestador!.servicio,
        prestador?.especialidad || '',
        lastDoc,
        limit,
      ),
    {
      enabled: !!prestador,
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

  const { data: totalSupportRequests, isLoading: totalSupportRequestsIsLoading } = useQuery(
    'totalSupportRequests',
    () => getTotalSupportRequests(),
    {},
  );

  const { mutate: deleteSupportRequestMutation, isLoading: isDeleteSupportRequestLoading } =
    useMutation('deleteSupportRequest', deleteSupportRequest, {
      onSuccess: () => {
        queryClient.invalidateQueries('userSupportRequests');
      },
    });

  return {
    userSupportRequests,
    isSupportRequestsLoading,
    isSupportRequestsError,
    deleteSupportRequestMutation,
    isDeleteSupportRequestLoading,
    infiniteSupportRequests,
    infiniteSupportRequestsIsLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    totalSupportRequests,
    totalSupportRequestsIsLoading,
  };
};

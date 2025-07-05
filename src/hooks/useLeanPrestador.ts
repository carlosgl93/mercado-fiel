import { notificationState } from '@/store/snackbar';
import { useSetRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import { getLeanPrestador } from '@/api/prestadores';

export const usePrestador = (prestadorId: string) => {
  const setNotification = useSetRecoilState(notificationState);

  const {
    data: prestador,
    isError,
    isLoading,
    error,
  } = useQuery(['prestador', prestadorId], () => getLeanPrestador(prestadorId), {
    enabled: !!prestadorId,
    onError: (error) => {
      console.error(error);
      setNotification({
        open: true,
        message: 'Ocurrió un error al cargar el prestador',
        severity: 'error',
      });
    },
  });

  return {
    prestador,
    isError,
    isLoading,
    error,
  };
};

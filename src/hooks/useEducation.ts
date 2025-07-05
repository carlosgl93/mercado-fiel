import { deleteEducacion, getEducacion, postEducacion } from '@/api/educacionFormacion';
import useAuth from '@/store/auth';
import { notificationState } from '@/store/snackbar';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import { construirPerfilState } from '@/store/construirPerfil';
import { EducacionInputs } from '@/pages/ConstruirPerfil/EducacionFormacion/EducacionFormacion';

export const useEducation = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [, setConstruirPerfil] = useRecoilState(construirPerfilState);

  const [{ user }] = useAuth();

  const client = useQueryClient();

  const { data: educacionData, isLoading: educacionIsLoading } = useQuery<
    EducacionInputs[],
    AxiosError
  >('prestadorEducacion', () => getEducacion(user?.id ?? ''), {
    onError: (error: AxiosError) => {
      setNotification({
        ...notification,
        open: true,
        message: `Hubo un error obteniendo tu cuenta: ${error.message}`,
        severity: 'error',
      });
    },
    onSuccess: (data) => {
      setConstruirPerfil((prev) => {
        return {
          ...prev,
          educacionFormacion: data,
        };
      });
    },
  });

  const {
    mutate: saveEducacion,
    isLoading: postEducacionLoading,
    error: postEducacionError,
  } = useMutation(
    (data: EducacionInputs[]) => {
      setNotification(() => {
        return {
          ...notification,
          open: true,
          message: 'Guardando educación',
          severity: 'info',
        };
      });
      return postEducacion(
        data?.map((historial) => ({
          ...historial,
          prestadorId: user?.id ?? '',
        })),
      );
    },
    {
      onError: (error: AxiosError) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error guardando tu educación: ${error.message}`,
          severity: 'error',
        });
      },
      onSuccess: () => {
        setNotification({
          ...notification,
          open: true,
          message: 'Educación guardada',
          severity: 'success',
        });
        client.invalidateQueries('prestadorEducacion');
      },
    },
  );

  const {
    mutate: deleteEducacionMutation,
    isLoading: deleteEducacionLoading,
    error: deleteEducacionError,
  } = useMutation(
    (id: number) => {
      setNotification(() => {
        return {
          ...notification,
          open: true,
          message: 'Eliminando educación',
          severity: 'info',
        };
      });
      return deleteEducacion(id);
    },
    {
      onError: (error: AxiosError) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error eliminando tu educación: ${error.message}`,
          severity: 'error',
        });
      },
      onSuccess: () => {
        setNotification({
          ...notification,
          open: true,
          message: 'Educación eliminada',
          severity: 'success',
        });
        client.invalidateQueries('prestadorEducacion');
      },
    },
  );

  return {
    educacionData,
    educacionIsLoading,
    saveEducacion,
    postEducacionLoading,
    postEducacionError,
    deleteEducacionMutation,
    deleteEducacionError,
    deleteEducacionLoading,
  };
};

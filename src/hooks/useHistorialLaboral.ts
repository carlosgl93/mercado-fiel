import { deleteHistorialEntry } from '@/api/historialLaboral/deleteHistorialEntry';
import { getHistorialLaboral } from '@/api/historialLaboral/getHistorialLaboral';
import { postHistorialLaboral } from '@/api/historialLaboral/postHistorialLaboral';
import useAuth from '@/store/auth';
import { construirPerfilState } from '@/store/construirPerfil';
import { notificationState } from '@/store/snackbar';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAuthNew } from './useAuthNew';

export type HistorialLaboralEntry = {
  id?: number;
  dbId?: number;
  empresa: string;
  inicio: string;
  final: string;
  titulo: string;
  todavia: boolean;
};

export const useHistorialLaboral = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [, setConstruirPerfil] = useRecoilState(construirPerfilState);

  const [{ user }] = useAuth();
  const { isLoggedIn } = useAuthNew();

  const router = useNavigate();
  const client = useQueryClient();

  const {
    data: prestadorHistorialLaboral,
    isLoading: getPrestadorHistorialLaboralLoading,
    error: getPrestadorHistorialLaboralError,
  } = useQuery<HistorialLaboralEntry[], AxiosError>(
    ['prestadorHistorialLaboral', user?.id ?? ''],
    () => getHistorialLaboral(user?.id ?? ''),
    {
      onError: (error: AxiosError) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error obteniendo tu historial: ${error.message}`,
          severity: 'error',
        });
      },
      onSuccess: (data) => {
        setConstruirPerfil((prev) => {
          return {
            ...prev,
            historialLaboral: data,
          };
        });
      },
    },
  );

  const {
    mutate,
    isLoading: postHistorialPrestadorLaboralLoading,
    error: postHistorialPrestadorLaboralError,
  } = useMutation(
    (data: HistorialLaboralEntry[]) => {
      setNotification(() => {
        return {
          ...notification,
          open: true,
          message: 'Guardando tu historial laboral',
          severity: 'info',
        };
      });
      return postHistorialLaboral(
        data?.map((historial) => ({
          ...historial,
          prestadorId: user?.id ?? '',
        })),
      );
    },
    {
      onSuccess: () => {
        client.invalidateQueries('prestadorHistorialLaboral');
        setNotification({
          ...notification,
          open: true,
          message: 'Historial guardado exitosamente',
          severity: 'success',
        });
      },
      onError: (error: { message: string }) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error guardando tu historial: ${error.message}`,
          severity: 'error',
        });
      },
    },
  );

  const {
    mutate: deleteHistorialEntryMutation,
    isLoading: deleteHistorialEntryLoading,
    error: deleteHistorialEntryError,
  } = useMutation(
    (data: number) => {
      setNotification(() => {
        return {
          ...notification,
          open: true,
          message: 'Eliminando tu historial laboral',
          severity: 'info',
        };
      });
      return deleteHistorialEntry(data);
    },
    {
      onSuccess: () => {
        client.invalidateQueries('prestadorCuentaBancaria');
        if (prestadorHistorialLaboral?.length === 0) {
          setConstruirPerfil((prev) => {
            return {
              ...prev,
              historialLaboral: [],
            };
          });
        }
        setNotification({
          ...notification,
          open: true,
          message: 'Historial eliminado exitosamente',
          severity: 'success',
        });
      },
      onError: (error: { message: string }) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error guardando tu cuenta: ${error.message}`,
          severity: 'error',
        });
        client.refetchQueries('prestadorHistorialLaboral');
      },
    },
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router('/ingresar');
    }
  }, [user]);

  return {
    prestadorHistorialLaboral,
    getPrestadorHistorialLaboralLoading,
    getPrestadorHistorialLaboralError,
    postHistorialPrestadorLaboral: mutate,
    deleteHistorialEntryMutation,
    deleteHistorialEntryLoading,
    deleteHistorialEntryError,
    postHistorialPrestadorLaboralLoading,
    postHistorialPrestadorLaboralError,
  };
};

import { getCuentaBancaria } from '@/api/cuentaBancaria/getCuentaBancaria';
import { CuentaBancariaInputs } from '@/pages/ConstruirPerfil/CuentaBancaria/CuentaBancaria';
import { construirPerfilState } from '@/store/construirPerfil';
import { notificationState } from '@/store/snackbar';
import { CuentaBancaria } from '@/types/CuentaBancaria';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAuthNew } from './useAuthNew';
import { postCuentaBancaria } from '@/api/cuentaBancaria/postCuentaBancaria';
import { Prestador, prestadorState } from '@/store/auth/prestador';

export const useCuentaBancaria = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [, setConstruirPerfil] = useRecoilState(construirPerfilState);
  const [prestador, setPrestador] = useRecoilState(prestadorState);

  const { user } = useAuthNew();
  const searchedId = prestador?.id ?? user?.id ?? '';

  const router = useNavigate();
  const client = useQueryClient();

  const {
    data: cuentaBancaria,
    isLoading: getCuentaBancariaLoading,
    error: getCuentaBancariaError,
  } = useQuery<CuentaBancaria, AxiosError>('cuentaBancaria', () => getCuentaBancaria(searchedId), {
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
          cuentaBancaria: data,
        };
      });
    },
  });

  const {
    mutate: mutateCuentaBancaria,
    isLoading: postCuentaBancariaLoading,
    error: postCuentaBancariaError,
  } = useMutation(
    (data: CuentaBancariaInputs) => {
      setNotification(() => {
        return {
          ...notification,
          open: true,
          message: 'Guardando tu cuenta bancaria',
          severity: 'info',
        };
      });
      return postCuentaBancaria(prestador?.id, { id: searchedId, ...data });
    },
    {
      onSuccess: () => {
        client.invalidateQueries('cuentaBancaria');
        setPrestador(
          (prev) =>
            ({
              ...prev,
              settings: {
                ...prev?.settings,
                cuentaBancaria: true,
              },
            } as Prestador),
        );
        setNotification({
          ...notification,
          open: true,
          message: 'Cuenta bancaria guardada',
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
      },
    },
  );

  useEffect(() => {
    if (!prestador?.id.length) {
      router('/ingresar');
    }
  }, []);

  return {
    cuentaBancaria,
    getCuentaBancariaLoading,
    getCuentaBancariaError,
    postCuentaBancariaLoading,
    postCuentaBancariaError,
    mutateCuentaBancaria,
  };
};

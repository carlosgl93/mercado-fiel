import useAuth from '@/store/auth';
import { construirPerfilState } from '@/store/construirPerfil';
import { notificationState } from '@/store/snackbar';
import { TarifaFront } from '@/types';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
// import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getPrestadorTarifas } from '@/api/tarifas';

export const useTarifas = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [, setConstruirPerfil] = useRecoilState(construirPerfilState);

  const [{ user }] = useAuth();

  //   const router = useNavigate();
  //   const client = useQueryClient();

  const {
    data: tarifasData,
    isLoading: getTarifasLoading,
    error: getTarifasError,
  } = useQuery<TarifaFront[], AxiosError>(
    'prestadorTarifas',
    () => getPrestadorTarifas(user?.id ?? ''),
    {
      onError: (error: AxiosError) => {
        setNotification({
          ...notification,
          open: true,
          message: `Hubo un error obteniendo tus tarifas: ${error.message}`,
          severity: 'error',
        });
      },
      onSuccess: (data) => {
        setConstruirPerfil((prev) => {
          return {
            ...prev,
            tarifas: data,
          };
        });
      },
    },
  );

  //   const {
  //     mutate: saveTarifas,
  //     isLoading: postTarifasLoading,
  //     error: postTarifasError,
  //   } = useMutation(
  //     (data) => {
  //       setNotification(() => {
  //         return {
  //           ...notification,
  //           open: true,
  //           message: 'Guardando tus tarifas',
  //           severity: 'info',
  //         };
  //       });
  //       console.log('plain data', data);
  //       // console.log('data from mutation', Object.fromEntries(data));

  //       // postTarifas(user?.id ?? '', true);
  //       // postFreeMeetGreet(user?.id ?? '', data.meetAndGreet);
  //     },
  //     {
  //       mutationKey: 'asdf',
  //     },
  //   );

  return {
    tarifasData,
    getTarifasLoading,
    getTarifasError,
    // saveTarifas,
    // postTarifasLoading,
    // postTarifasError,
  };
};

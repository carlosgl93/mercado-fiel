import { verifyPrestador } from '@/api/prestadores/verificarPrestador';
import { useLocation, useNavigate } from 'react-router-dom';
import { notificationState } from '@/store/snackbar';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

type Severity = 'success' | 'info' | 'warning' | 'error';

export const EmailVerificadoPrestadorController = () => {
  const [notification, setNotification] = useRecoilState(notificationState);

  const router = useNavigate();

  const params = useLocation();
  const query = new URLSearchParams(params.search);
  const token = query.get('token') || '';

  useEffect(() => {
    verifyPrestador(token)
      .then((res) => {
        if (res) {
          if (res.status === 'success') {
            console.log('exito');
            setNotification({
              ...notification,
              open: true,
              message: res!.message,
              severity: res!.status as Severity,
            });
            router(`/perfil-prestador/${res.prestador.id}`);
          } else {
            throw new Error(res.message);
          }
        }
      })
      .catch((err) => {
        console.log('failed');
        console.log(err);
        setNotification({
          ...notification,
          open: true,
          message: err!.message + '. Por favor, ingrese nuevamente',
          severity: 'error',
        });
        router('/ingresar');
      });
  }, []);

  return {};
};

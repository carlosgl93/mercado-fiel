import { useAuthNew } from '@/hooks';
import { notificationState } from '@/store/snackbar';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export const usePrestadorDashboard = () => {
  const { prestador } = useAuthNew();
  const setNotification = useSetRecoilState(notificationState);

  const shouldDisableEncuentraClientes =
    !prestador?.settings.servicios || !prestador?.profileImageUrl;
  const router = useNavigate();

  const handleConstruirPerfil = () => {
    router('/construir-perfil');
  };

  const handleSesiones = () => {
    router('/sesiones');
  };

  const handleEncuentraClientes = () => {
    if (shouldDisableEncuentraClientes) {
      setNotification({
        open: true,
        message: 'Debes completar tu perfil para poder encontrar clientes.',
        severity: 'error',
      });
      return;
    }
    router('/encuentra-clientes');
  };

  return {
    shouldDisableEncuentraClientes,
    prestador,
    handleSesiones,
    handleConstruirPerfil,
    handleEncuentraClientes,
  };
};

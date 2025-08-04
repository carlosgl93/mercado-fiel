import { notificationState } from '@/store/snackbar';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../hooks';

export const usePrestadorDashboard = () => {
  const { proveedor } = useAuth();
  const setNotification = useSetRecoilState(notificationState);

  const shouldDisableEncuentraClientes =
    !proveedor?.settings?.servicios || !proveedor?.profileImageUrl;
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
    prestador: proveedor,
    handleSesiones,
    handleConstruirPerfil,
    handleEncuentraClientes,
  };
};

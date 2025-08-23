import { notificationState } from '@/store/snackbar';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';

export const useProveedorDashboard = () => {
  const { supplier } = useAuth();
  const setNotification = useSetRecoilState(notificationState);

  console.log({ supplier });
  console.log(supplier?.descripcion, supplier?.profile_picture_url, supplier?.nombreNegocio);

  // Basic profile completion check
  const isProfileComplete = !!(
    supplier?.descripcion &&
    supplier?.profile_picture_url &&
    supplier?.nombreNegocio
  );

  // Check if supplier can publish products (needs complete profile)
  const shouldDisablePublicarProductos = !isProfileComplete;

  // Check if supplier can manage sales (needs products - this would need to be checked via API)
  // For now, we'll disable if profile is incomplete
  const shouldDisableVentas = !isProfileComplete;

  // Legacy check for backward compatibility
  const shouldDisableEncuentraClientes = !supplier?.descripcion || !supplier?.profile_picture_url;

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
    shouldDisablePublicarProductos,
    shouldDisableVentas,
    isProfileComplete,
    prestador: supplier,
    handleSesiones,
    handleConstruirPerfil,
    handleEncuentraClientes,
  };
};

import { proveedorState } from '@/store/auth/proveedor';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export const useConstruirPerfilNew = () => {
  const prestador = useRecoilValue(proveedorState);
  const navigate = useNavigate();
  const settings = prestador ? prestador!.settings : undefined;

  useEffect(() => {
    if (!prestador?.rut) {
      navigate('/ingresar');
    }

    if (!settings) {
      navigate('/ingresar');
    }
  }, []);

  return {
    settings,
  };
};

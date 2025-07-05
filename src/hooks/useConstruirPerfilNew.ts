import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { prestadorState } from '@/store/auth/prestador';
import { useEffect } from 'react';

export const useConstruirPerfilNew = () => {
  const prestador = useRecoilValue(prestadorState);
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

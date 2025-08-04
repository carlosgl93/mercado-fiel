import { updatePrestadorDetallesBasicos } from '@/api/prestadores/updatePrestadorDetallesBasicos';
import { Prestador, proveedorState } from '@/store/auth/proveedor';
import { notificationState } from '@/store/snackbar';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { IDetallesBasicosInputs } from './DetallesBasicos';

export const useDetallesBasicos = () => {
  const [prestador, setPrestadorState] = useRecoilState(proveedorState);
  const setNotification = useSetRecoilState(notificationState);
  const { mutate: updatePrestadorMutation, isLoading: updatePrestadorLoading } = useMutation(
    updatePrestadorDetallesBasicos,
    {
      onSuccess: (data) => {
        setNotification({
          open: true,
          message: 'Perfil actualizado correctamente',
          severity: 'success',
        });
        setPrestadorState(
          (prev) =>
            ({
              ...prev,
              ...data,
              settings: {
                ...prev?.settings,
                detallesBasicos: true,
              },
            } as Prestador),
        );
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      },
    },
  );

  const onSubmit = async (data: IDetallesBasicosInputs) => {
    try {
      updatePrestadorMutation({ prestador: data, id: prestador?.id ?? '' });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return {
    prestador,
    updatePrestadorLoading,
    onSubmit,
  };
};

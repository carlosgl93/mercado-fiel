import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMutation } from 'react-query';
import { notificationState } from '@/store/snackbar';
import { IDetallesBasicosInputs } from './DetallesBasicos';
import { Prestador, prestadorState } from '@/store/auth/prestador';
import { updatePrestadorDetallesBasicos } from '@/api/prestadores/updatePrestadorDetallesBasicos';

export const useDetallesBasicos = () => {
  const [prestador, setPrestadorState] = useRecoilState(prestadorState);
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

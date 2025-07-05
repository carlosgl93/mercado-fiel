import { getPrestadorExperience } from '@/api/experience/getPrestadorExperience';
import { ExperienceState } from '@/store/construirPerfil/experiencia';
import { notificationState } from '@/store/snackbar';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';

export const usePrestadorExperience = (
  prestadorId: string,
  onSuccessAction: (data: ExperienceState) => void,
) => {
  const [notification, setNotification] = useRecoilState(notificationState);

  const { isLoading, data: prestadorExperiencia } = useQuery(
    ['prestadorExperience', prestadorId],
    () => getPrestadorExperience(prestadorId),
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      onError: (error: { message: string }) => {
        setNotification({
          ...notification,
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
      onSuccess: (data: ExperienceState) => {
        onSuccessAction(data);
      },
    },
  );

  return {
    isLoading,
    prestadorExperiencia,
  };
};

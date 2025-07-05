import { Apoyo } from '@/api/supportRequests';
import { useAuthNew, useServicios, useSupportRequests } from '@/hooks';
import { useNavigate } from 'react-router-dom';

export const ApoyoController = () => {
  const { user } = useAuthNew();
  const router = useNavigate();
  const { getServiceIcon } = useServicios();
  const {
    userSupportRequests,
    isSupportRequestsLoading,
    isSupportRequestsError,
    deleteSupportRequestMutation,
    isDeleteSupportRequestLoading,
  } = useSupportRequests(user?.id);

  const handleReadApoyo = (apoyo: Apoyo) => {
    router(`/ver-apoyo/${apoyo.id}`, {
      state: {
        apoyo,
      },
    });
  };

  const handleCreateApoyo = () => {
    router('/mis-apoyos/crear');
  };

  const handleDeleteApoyo = (apoyoId: string) => {
    deleteSupportRequestMutation(apoyoId);
  };

  return {
    handleReadApoyo,
    handleCreateApoyo,
    handleDeleteApoyo,
    userSupportRequests,
    isSupportRequestsLoading,
    isSupportRequestsError,
    getServiceIcon,
    deleteSupportRequestMutation,
    isDeleteSupportRequestLoading,
  };
};

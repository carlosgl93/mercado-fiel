import { redirectToAfterLoginState } from '@/store/auth';
import { tablet } from '@/theme/breakpoints';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Prestador } from '@/store/auth/prestador';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { useAuthNew } from '@/hooks/useAuthNew';
import { useChat, useNavigationHistory } from '@/hooks';
import { interactedPrestadorState } from '@/store/resultados/interactedPrestador';
import { scheduleModalState } from '@/store/schedule/sheduleState';

export const usePerfilPrestador = (prestador: Prestador) => {
  const isTablet = useMediaQuery(tablet);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuthNew();
  const setRedirectToAfterLogin = useSetRecoilState(redirectToAfterLoginState);
  const history = useNavigationHistory();
  const prestadorId = prestador?.id;
  const { messages, messagesLoading } = useChat(user?.id ?? '', prestador?.id);
  const [scheduleModalOpen, setScheduleModalOpen] = useRecoilState(scheduleModalState);
  const setNotification = useSetRecoilState(notificationState);
  const setInteractedPrestador = useSetRecoilState(interactedPrestadorState);

  const handleOpenScheduleModal = () => setScheduleModalOpen(true);
  const handleCloseScheduleModal = () => setScheduleModalOpen(false);

  const fromRecibeApoyo =
    history.filter((h) => !h.includes('/registrar-usuario') && h.includes('/recibe-apoyo')).length >
    0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleContact = () => {
    if (user?.id.length) {
      if ((messages?.messages ?? []).length > 0) {
        navigate('/chat', {
          state: {
            prestador,
            messages,
            sentBy: user.role || 'user',
          },
        });
        return;
      }
      handleOpen();
      return;
    }

    setRedirectToAfterLogin(`/perfil-prestador/${prestadorId}`);
    setNotification({
      open: true,
      message: 'Debes crearte una cuenta o iniciar sesión para poder contactar a un prestador',
      severity: 'info',
    });
    if (fromRecibeApoyo) {
      navigate('/registrar-usuario');
    } else {
      navigate('/ingresar');
    }
    return;
  };

  const handleSchedule = () => {
    if (user?.id.length) {
      // handle react big calendar
      handleOpenScheduleModal();
      return;
    }
    setRedirectToAfterLogin(`/perfil-prestador/${prestadorId}`);
    setNotification({
      open: true,
      message: 'Debes crearte una cuenta o iniciar sesión para poder agendar.',
      severity: 'info',
    });

    if (fromRecibeApoyo) {
      navigate('/registrar-usuario');
    } else {
      navigate('/ingresar');
    }
    return;
  };

  useEffect(() => {
    setInteractedPrestador(prestador);
  }, []);

  return {
    prestador,
    messages,
    isTablet,
    open,
    scheduleModalOpen,
    message,
    messagesLoading,
    handleContact,
    handleOpen,
    handleClose,
    setMessage,
    handleSchedule,
    handleOpenScheduleModal,
    handleCloseScheduleModal,
  };
};

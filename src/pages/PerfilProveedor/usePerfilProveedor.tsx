import { useAuth, useChat, useNavigationHistory } from '@/hooks';
import { redirectToAfterLoginState } from '@/store/auth';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import { scheduleModalState } from '@/store/schedule/sheduleState';
import { notificationState } from '@/store/snackbar';
import { tablet } from '@/theme/breakpoints';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SupplierWithProducts } from '../../models';

export const usePerfilPrestador = (proveedor: SupplierWithProducts) => {
  const isTablet = useMediaQuery(tablet);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const setRedirectToAfterLogin = useSetRecoilState(redirectToAfterLoginState);
  const history = useNavigationHistory();
  const prestadorId = proveedor?.idProveedor;
  // const { messages, messagesLoading } = useChat(user?.idProveedor ?? '', proveedor?.idProveedor);
  const { messages, messagesLoading } = useChat('', '');
  const [scheduleModalOpen, setScheduleModalOpen] = useRecoilState(scheduleModalState);
  const setNotification = useSetRecoilState(notificationState);
  const setInteractedPrestador = useSetRecoilState(interactedProveedorState);

  const handleOpenScheduleModal = () => setScheduleModalOpen(true);
  const handleCloseScheduleModal = () => setScheduleModalOpen(false);

  const fromRecibeApoyo =
    history.filter((h) => !h.includes('/registrar-usuario') && h.includes('/recibe-apoyo')).length >
    0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleContact = () => {
    if (user) {
      if ((messages?.messages ?? []).length > 0) {
        navigate('/chat', {
          state: {
            prestador: proveedor,
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
    if (user) {
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
    setInteractedPrestador(proveedor);
  }, []);

  return {
    prestador: proveedor,
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

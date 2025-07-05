import { useAuthNew } from '@/hooks';
import { useAppointments } from '@/hooks/useAppointments';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SessionController = () => {
  const { userAppointments, userAppointmentsLoading } = useAppointments();
  const { user, prestador } = useAuthNew();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email && prestador?.email) {
      navigate('/ingresar');
    }
  }, []);

  return {
    userAppointments,
    userAppointmentsLoading,
  };
};

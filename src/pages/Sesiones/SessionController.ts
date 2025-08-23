import { useAppointments } from '@/hooks/useAppointments';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthSupabase';

export const SessionController = () => {
  const { userAppointments, userAppointmentsLoading } = useAppointments();
  const { user, supplier } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.data?.email && supplier?.email) {
      navigate('/ingresar');
    }
  }, []);

  return {
    userAppointments,
    userAppointmentsLoading,
  };
};

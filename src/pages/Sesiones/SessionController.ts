import { useAppointments } from '@/hooks/useAppointments';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

export const SessionController = () => {
  const { userAppointments, userAppointmentsLoading } = useAppointments();
  const { user, proveedor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email && proveedor?.email) {
      navigate('/ingresar');
    }
  }, []);

  return {
    userAppointments,
    userAppointmentsLoading,
  };
};

import { userAppointmentsState } from '@/store/appointments';
import { providerAppointmentsState } from '@/store/appointments/providerAppointmentsState';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';
import { ListProviderSessions } from './Provider/ListProviderSessions';
import { ListUserSessions } from './User/ListUserSessions';

export const ListSesiones = () => {
  const userSessions = useRecoilValue(userAppointmentsState);
  const providerSessions = useRecoilValue(providerAppointmentsState);

  const { user } = useAuth();

  if (user?.data?.id_usuario) {
    return <ListUserSessions userSessions={userSessions} />;
  } else {
    return <ListProviderSessions providerSessions={providerSessions} />;
  }
};

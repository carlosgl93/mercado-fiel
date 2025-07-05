import { useAuthNew } from '@/hooks';
import { useRecoilValue } from 'recoil';
import { ListUserSessions } from './User/ListUserSessions';
import { userAppointmentsState } from '@/store/appointments';
import { ListProviderSessions } from './Provider/ListProviderSessions';
import { providerAppointmentsState } from '@/store/appointments/providerAppointmentsState';

export const ListSesiones = () => {
  const userSessions = useRecoilValue(userAppointmentsState);
  const providerSessions = useRecoilValue(providerAppointmentsState);

  const { user } = useAuthNew();

  if (user?.id) {
    return <ListUserSessions userSessions={userSessions} />;
  } else {
    return <ListProviderSessions providerSessions={providerSessions} />;
  }
};

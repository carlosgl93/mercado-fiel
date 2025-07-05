import { Appointment } from '@/api/appointments';
import { atom } from 'recoil';

export const providerAppointmentsState = atom<Appointment[]>({
  key: 'providerAppointmentsState',
  default: [],
});

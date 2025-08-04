import { Appointment } from '@/api/appointments';
import { Customer } from '@/models';
import dayjs from 'dayjs';
import { DocumentData } from 'firebase/firestore';
import { atom } from 'recoil';

export type UserAppointment = {
  scheduledTimeAndDate: dayjs.Dayjs;
  provider: DocumentData | undefined;
  service: DocumentData;
  isPaid: boolean | undefined;
  customer: Customer;
};

export const userAppointmentsState = atom<Appointment[]>({
  key: 'userAppointmentsState',
  default: [],
});

export const searchedAppointmentState = atom<string>({
  key: 'searchedAppointmentState',
  default: '',
});

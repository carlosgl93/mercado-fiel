import { Appointment } from '@/api/appointments';
import dayjs from 'dayjs';

export const fakeTodayAppointments: Appointment[] = [
  {
    id: '12345',
    provider: {
      id: 'provider123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'provider@example.com',
    },
    servicio: {
      id: 'service123',
      name: 'Service Name',
      description: 'Service Description',
      price: '100',
      speciality: 'speciality',
      duration: 60,
    },
    customer: {
      id: 'customer123',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'customer@example.com',
    },
    scheduledDate: dayjs().add(3, 'hours').toString(),
    scheduledTime: '10:00 AM',
    isPaid: 'Pagado',
    createdAt: dayjs(),
    status: 'Agendada',
    rating: 5,
    confirmedByUser: true,
    paykuId: 'payku12345',
    paykuPaymentURL: 'https://payku.com/payment/12345',
  },
];

export const fakeFutureApps: Appointment[] = [
  {
    id: '12345',
    provider: {
      id: 'provider123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'provider@example.com',
    },
    servicio: {
      id: 'service123',
      name: 'Service Name',
      description: 'Service Description',
      price: '100',
      speciality: 'speciality',
      duration: 60,
    },
    customer: {
      id: 'customer123',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'customer@example.com',
    },
    scheduledDate: dayjs().add(3, 'days').toString(),
    scheduledTime: '10:00',
    isPaid: 'Pagado',
    createdAt: dayjs(),
    status: 'Agendada',
    rating: 5,
    confirmedByUser: true,
    paykuId: 'payku12345',
    paykuPaymentURL: 'https://payku.com/payment/12345',
  },
];

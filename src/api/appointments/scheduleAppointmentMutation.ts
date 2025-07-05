import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import { User } from '@/store/auth/user';
import { Prestador } from '@/types';
import dayjs, { Dayjs } from 'dayjs';
import { db } from '@/firebase/firebase';
import { addDoc, collection, DocumentReference, FieldValue } from 'firebase/firestore';
import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';

export type ScheduleAppointmentProvider = Pick<
  Prestador,
  'id' | 'firstname' | 'lastname' | 'email'
>;
export type ScheduleAppointmentCustomer = Pick<User, 'id' | 'firstname' | 'lastname' | 'email'>;
export type TisPaid =
  | boolean
  | 'Confirmando'
  | 'Confirmada'
  | 'Transferencia no encontrada'
  | 'Pagado'
  | 'failed'
  | 'approved'
  | undefined;

export type TStatus =
  | 'Agendada'
  | 'Realizada'
  | 'Esperando confirmación del cliente'
  | 'Pendiente de pago'
  | 'Pagada';

export interface Appointment {
  id?: string;
  provider: ScheduleAppointmentProvider;
  servicio: UserCreatedServicio;
  customer: ScheduleAppointmentCustomer;
  scheduledDate: string;
  scheduledTime: string;
  isPaid?: TisPaid;
  createdAt?: FieldValue | string | dayjs.Dayjs;
  status: TStatus;
  rating: number;
  confirmedByUser: boolean;
  paykuId?: string;
  paykuPaymentURL?: string;
  scheduledDateISO?: string;
}

export interface ScheduleAppointmentParams extends Appointment {
  isMultiple?: boolean;
  howManySessionsToConfirm?: number;
  totalPaidScheduling?: number;
  providersAvailability: AvailabilityData[] | undefined;
}

export interface PaymentRecord extends ScheduleAppointmentParams {
  amountToPay: number;
  appointmentId: string;
  paymentStatus: string;
  paymentDueDate: Dayjs;
}

export async function scheduleService(appointments: ScheduleAppointmentParams[]) {
  const promises: Promise<DocumentReference>[] = [];
  const newAppointments: Appointment[] = [];
  appointments.forEach((app) => {
    const scheduledDateISO = dayjs(
      `${app.scheduledDate}T${app.scheduledTime}:00.000Z`,
    ).toISOString();
    const newAppointment: Appointment = {
      provider: app.provider,
      servicio: app.servicio,
      customer: app.customer,
      scheduledDate: app.scheduledDate,
      scheduledTime: app.scheduledTime,
      isPaid: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: 'Pendiente de pago',
      rating: 0,
      confirmedByUser: false,
      scheduledDateISO,
    };
    promises.push(addDoc(collection(db, 'appointments'), newAppointment));
    newAppointments.push(newAppointment);
  });
  const results = await Promise.all(promises);
  return newAppointments.map((app, i) => ({ ...app, id: results[i].id }));
}

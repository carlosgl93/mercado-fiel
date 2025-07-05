import { db } from '@/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Appointment } from './scheduleAppointmentMutation';
import { sortUserAppointments } from '@/utils/sortUserAppointments';

export const getProviderAppointments = async (providerId: string) => {
  if (!providerId) {
    throw new Error('Provider ID is required');
  }
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, where('provider.id', '==', providerId));
  const querySnapshot = await getDocs(q);
  return sortUserAppointments(
    querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Appointment[],
  );
};

import { db } from '@/firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export const cancelAppointmentMutation = async (appointmentId: string) => {
  const appointmentDocRef = doc(db, 'appointments', appointmentId);
  await deleteDoc(appointmentDocRef);
};

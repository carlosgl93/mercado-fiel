import { db } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const paymentVerificationFailedMutation = async (appointmentId: string) => {
  const appointmentDocRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentDocRef, { isPaid: 'Transferencia no encontrada' });
};

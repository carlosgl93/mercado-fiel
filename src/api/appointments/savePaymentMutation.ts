import { db } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function savePaymentMutation(appointmentId: string) {
  const docRef = doc(db, 'appointments', appointmentId);
  await updateDoc(docRef, { isPaid: 'Confirmando' });
}

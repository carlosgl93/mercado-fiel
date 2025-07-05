/**;
 *
 * @param appointmentId: string
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePayment } from './updatePayment';

export async function confirmAppointmentDone(appointmentId: string) {
  const appointmentRefDoc = doc(db, 'appointments', appointmentId);

  try {
    await updateDoc(appointmentRefDoc, {
      confirmedByUser: true,
      status: 'Realizada',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
  updatePayment(appointmentId);
}

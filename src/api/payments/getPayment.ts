/**;
 *
 * @param  appointmentId: appointment document id
 * @returns  Returns the status of the appointment payment
 *
 */

import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface PaymentDetails {
  isPaid: string;
}

export async function getPaymentStatus(appointmentId: string | null): Promise<PaymentDetails> {
  if (!appointmentId) {
    throw new Error('missing appointment details');
  }

  const paymentRef = doc(db, 'appointments', appointmentId);
  const snapshot = await getDoc(paymentRef);

  if (!snapshot.exists()) {
    throw new Error(`No payment found for appointment ID: ${appointmentId}`);
  }

  const paymentStatus = snapshot.data().isPaid;
  return paymentStatus as PaymentDetails;
}

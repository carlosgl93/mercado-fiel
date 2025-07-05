/**;
 *
 * @param appointmentId: string
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

export async function updatePayment(appointmentId: string) {
  const paymentsCollectionRef = collection(db, 'payments');
  const paymentQuery = query(paymentsCollectionRef, where('appointmentId', '==', appointmentId));
  try {
    const payment = (await getDocs(paymentQuery)).docs[0];
    await updateDoc(doc(db, 'payments', payment?.id), {
      paymentStatus: 'Ready to pay',
      confirmedByUser: true,
      status: 'Realizada',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

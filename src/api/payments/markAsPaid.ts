/**;
 *
 * @param id: appointment id string
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function markAsPaid(id: string | undefined) {
  if (!id) {
    throw new Error('No payment Id');
  }

  const docRef = doc(db, 'payments', id);
  try {
    await updateDoc(docRef, {
      paymentStatus: 'Pagado',
      isPaid: 'Pagado',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

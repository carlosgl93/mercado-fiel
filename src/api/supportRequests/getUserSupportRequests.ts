/**;
 *
 * @param  Params
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Apoyo } from './addSupportRequest';

export async function getUserSupportRequests(userid: string) {
  const userSuppReqRef = collection(db, 'supportRequests');
  const q = query(userSuppReqRef, where('userId', '==', userid));
  try {
    const data = await getDocs(q);
    return data.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Apoyo;
    });
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw new Error('Error fetching support requests');
  }
}

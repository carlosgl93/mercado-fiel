/**;
 *
 * @param
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export async function getTotalSupportRequests() {
  const supportReqsRef = collection(db, 'supportRequests');
  const querySnapshot = await getCountFromServer(supportReqsRef);
  return querySnapshot.data().count;
}

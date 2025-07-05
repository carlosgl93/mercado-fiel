/**;
 *
 * @param  Params
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export async function deleteSupportRequest(apoyoId: string) {
  const docRef = doc(db, 'supportRequests', apoyoId);
  try {
    // Delete the document
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
}

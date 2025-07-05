/**;
 *
 * @param  Params
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { Apoyo } from './addSupportRequest';

export async function getSupportRequests(
  comunasIds: Array<number> | undefined,
  servicio: string,
  especialidad: string,
  lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> | null,
  pageSize = 10,
) {
  const userSuppReqRef = collection(db, 'supportRequests');
  let q = query(userSuppReqRef, limit(pageSize));

  if (comunasIds && comunasIds.length > 0) {
    q = query(q, where('comunasIds', 'array-contains-any', comunasIds));
  }

  if (servicio) {
    q = query(q, where('serviceName', '==', servicio));
  }

  if (especialidad) {
    q = query(q, where('especialidadName', '==', especialidad));
  }

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  try {
    const data = await getDocs(q);
    const supportRequests = data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Apoyo;
    });
    const lastDoc = data.docs[data.docs.length - 1];
    return { supportRequests, lastDoc };
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw new Error('Error fetching support requests');
  }
}

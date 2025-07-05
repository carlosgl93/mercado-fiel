/**;
 *
 * @param {void} none
 * @returns number of prestadores created (prestadores seeking support not providers + prestadores.)
 *
 */

import { db } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export async function getPrestadoresCount(): Promise<number> {
  const prestadoresColRef = collection(db, 'providers');
  try {
    const prestadoresCount = (await getCountFromServer(prestadoresColRef)).data().count;
    return prestadoresCount;
  } catch (error) {
    console.error('Error getting prestadores count: ', error);
    throw new Error('Error getting prestadores count');
  }
}

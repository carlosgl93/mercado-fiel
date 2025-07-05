/**;
 *
 * @param {void} none
 * @returns number of users created (users seeking support not providers + users.)
 *
 */

import { db } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export async function getUsersCount(): Promise<number> {
  const usersColRef = collection(db, 'users');
  try {
    const usersCount = (await getCountFromServer(usersColRef)).data().count;
    return usersCount;
  } catch (error) {
    console.error('Error getting users count: ', error);
    throw new Error('Error getting users count');
  }
}

import { db } from '@/firebase/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export const getTotalClientesQuery = async () => {
  const clientesRef = collection(db, 'users');
  const querySnapshot = await getCountFromServer(clientesRef);
  return querySnapshot.data().count;
};

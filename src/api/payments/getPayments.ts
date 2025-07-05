import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getPayments = async () => {
  const paymentsRef = collection(db, 'payments');
  const querySnapshot = await getDocs(paymentsRef);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

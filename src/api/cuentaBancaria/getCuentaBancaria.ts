import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { CuentaBancaria } from '@/types/CuentaBancaria';

export const getCuentaBancaria = async (id: string) => {
  const docRef = doc(db, 'bankAccounts', id);
  try {
    const result = await getDoc(docRef);
    return result.data() as CuentaBancaria;
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};

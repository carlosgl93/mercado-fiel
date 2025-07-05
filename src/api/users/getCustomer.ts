import { db } from '@/firebase';
import { User } from '@/store/auth/user';
import { doc, getDoc } from 'firebase/firestore';

export const getCustomer = async (id: string) => {
  const userRef = doc(db, 'users', id);
  try {
    const res = await getDoc(userRef);
    if (!res.exists()) {
      throw new Error('No existe un usuario con este id!');
    }
    return res.data() as User;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    }
  }
};

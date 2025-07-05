import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export const getAllExperiences = async (providerId: string) => {
  const docRef = doc(db, 'providers', providerId);
  try {
    const res = await getDoc(docRef);
    return res.data()?.experience;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
};

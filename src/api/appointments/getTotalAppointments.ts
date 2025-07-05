import { db } from '@/firebase/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export const getTotalAppointmentsQuery = async () => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const querySnapshot = await getCountFromServer(appointmentsRef);
    return querySnapshot.data();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

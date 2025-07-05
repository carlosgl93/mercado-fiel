import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

type User = {
  comuna: { name: string };
  service: 'Soporte Terapéutico' | 'Cuidadora' | 'Sana Compañía' | 'Servicios de enfermería';
};

type ComunaCount = {
  total: number;
  'Soporte Terapéutico'?: number;
  Cuidadora?: number;
  'Sana Compañía'?: number;
  'Servicios de enfermería'?: number;
};

export const getUsersPerComunaCount = async () => {
  const comunaCounts: Record<string, ComunaCount> = {};

  const usersRef = collection(db, 'users');
  try {
    const querySnapshot = await getDocs(usersRef);
    querySnapshot.forEach((doc) => {
      const userData: User = doc.data() as User;
      if (!comunaCounts[userData.comuna.name]) {
        comunaCounts[userData.comuna.name] = { total: 0 };
      }

      comunaCounts[userData.comuna.name].total += 1;

      if (comunaCounts[userData.comuna.name][userData.service] === undefined) {
        comunaCounts[userData.comuna.name][userData.service] = 0;
      }

      comunaCounts[userData.comuna.name][userData.service]! += 1;
    });
    return Object.entries(comunaCounts).map(([name, count]) => ({ name, count }));
  } catch (error) {
    console.error('Error getting users per comuna count:', error);
    throw new Error('Error getting users per comuna count');
  }
};

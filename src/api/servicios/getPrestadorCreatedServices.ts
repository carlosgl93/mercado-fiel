import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getPrestadorCreatedServices = async (prestadorId: string) => {
  const servicesRef = collection(db, 'providers', prestadorId, 'services');
  try {
    const serviceSnapshot = await getDocs(servicesRef);
    const services =
      serviceSnapshot.docs.map((doc) => {
        const service = doc.data();
        return {
          ...service,
          id: doc.id,
        };
      }) ?? [];
    return services as UserCreatedServicio[];
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to fetch services:', error);
    // Throw the error so that React Query can handle it
    throw error;
  }
};

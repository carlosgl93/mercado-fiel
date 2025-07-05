import { db } from '@/firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export type DeleteServiceParams = {
  prestadorId: string | undefined;
  serviceId: string;
};

export const deleteService = async ({ prestadorId, serviceId }: DeleteServiceParams) => {
  if (!prestadorId) {
    throw new Error('Debes iniciar sesion nuevamente');
  }

  const serviceRef = doc(db, 'providers', prestadorId, 'services', serviceId);
  try {
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw error;
  }
};

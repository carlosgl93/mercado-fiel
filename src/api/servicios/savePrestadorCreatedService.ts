import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import { db } from '@/firebase/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export type SavePrestadorCreatedServiceParams = {
  prestadorId: string | undefined;
  servicio: UserCreatedServicio;
};

export const savePrestadorCreatedService = async (data: SavePrestadorCreatedServiceParams) => {
  const { prestadorId, servicio } = data;
  const providerRef = doc(db, 'providers', prestadorId ?? '');
  const updateData = {
    'settings.servicios': true,
  };

  if (!prestadorId) {
    throw new Error('Debes iniciar sesion nuevamente');
  }
  const newId = uuidv4();
  const serviceRef = collection(db, 'providers', prestadorId, 'services');
  servicio.id = newId;
  try {
    await addDoc(serviceRef, servicio);
    await updateDoc(providerRef, updateData);
  } catch (error) {
    console.error('Failed to save service:', error);
    throw error;
  }
};

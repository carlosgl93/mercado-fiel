import { db } from '@/firebase/firebase';
import { Prestador } from '@/store/auth/prestador';
import { doc, updateDoc } from 'firebase/firestore';

export const verifyPrestadorMutation = async (prestador: Prestador) => {
  const prestadorRef = doc(db, 'providers', prestador.id);
  await updateDoc(prestadorRef, { verified: 'Verificado' });
  return prestador;
};

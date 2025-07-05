import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Prestador } from '@/store/auth/prestador';

export const failedVerifyPrestadorMutation = async (prestador: Prestador) => {
  const prestadorRef = doc(db, 'providers', prestador.id);
  await updateDoc(prestadorRef, { verified: 'Rechazado' });
  return prestador;
};

import { db } from '@/firebase/firebase';
import { Prestador } from '@/store/auth/proveedor';
import { doc, getDoc } from 'firebase/firestore';

export const getLeanPrestador = async (id: string): Promise<Prestador> => {
  const providersRef = doc(db, 'providers', id);
  const res = await getDoc(providersRef);
  const prestador = res.data() as Prestador;
  return prestador;
};

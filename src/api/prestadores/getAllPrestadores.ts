import { Prestador } from '@/store/auth/prestador';
import { db } from '@/firebase/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export const getAllPrestadores = async () => {
  const prestadorCollectionRef = collection(db, 'providers');
  const prestadoresQuery = query(prestadorCollectionRef, limit(15));

  const querySnapshot = await getDocs(prestadoresQuery);
  const prestadores = querySnapshot.docs.map((doc) => doc.data());

  return prestadores as Prestador[];
};

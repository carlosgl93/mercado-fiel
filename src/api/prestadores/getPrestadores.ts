import {
  collection,
  query,
  limit,
  where,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Especialidad, Servicio } from '@/types/Servicio';
import { Prestador } from '@/store/auth/prestador';
import { db } from '@/firebase/firebase';
import { Comuna } from '@/types';

export const getPrestadores = async (
  comuna: Comuna | null,
  servicio: Servicio | null,
  especialidad: Especialidad | null,
  lastVisible: QueryDocumentSnapshot<Prestador> | null = null,
  pageSize = 10,
) => {
  const prestadorCollectionRef = collection(db, 'providers');
  let prestadoresQuery = query(
    prestadorCollectionRef,
    where('verified', '!=', false),
    limit(pageSize),
  );

  if (comuna) {
    prestadoresQuery = query(prestadoresQuery, where('comunas', 'array-contains', comuna));
  }

  if (servicio) {
    prestadoresQuery = query(prestadoresQuery, where('servicio', '==', servicio.serviceName));
  }

  if (especialidad) {
    prestadoresQuery = query(
      prestadoresQuery,
      where('especialidad', '==', especialidad.especialidadName),
    );
  }

  if (lastVisible) {
    prestadoresQuery = query(prestadoresQuery, startAfter(lastVisible));
  }
  prestadoresQuery = query(prestadoresQuery, where('verified', '==', 'Verificado'));
  try {
    const querySnapshot = await getDocs(prestadoresQuery);
    const prestadores = querySnapshot.docs.map((doc) => doc.data() as Prestador);
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { prestadores, lastDoc };
  } catch (error) {
    console.error('Error fetching prestadores:', error);
    throw new Error('Error fetching prestadores');
  }
};

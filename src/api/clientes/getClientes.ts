import {
  collection,
  query,
  limit,
  where,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Comuna } from '@/types';
import { User } from '@/store/auth/user';

export const getClientes = async (
  comunas: Comuna[] | undefined,
  servicio: string | undefined,
  especialidad: string | undefined,
  lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> | null,
  pageSize = 10,
) => {
  const usersCollectionRef = collection(db, 'users');
  let usersQuery = query(usersCollectionRef, limit(pageSize));

  if (comunas && comunas.length > 0) {
    const comunaIds = comunas.map((comuna) => comuna.id);
    usersQuery = query(usersQuery, where('comuna.id', 'in', comunaIds));
  }

  if (servicio) {
    usersQuery = query(usersQuery, where('service', '==', servicio));
  }

  if (especialidad) {
    usersQuery = query(usersQuery, where('speciality', '==', especialidad));
  }

  if (lastVisible) {
    usersQuery = query(usersQuery, startAfter(lastVisible));
  }

  try {
    const querySnapshot = await getDocs(usersQuery);
    const clientes = querySnapshot.docs.map((doc) => doc.data() as User);
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { clientes, lastDoc };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { clientes: [], lastDoc: null };
  }
};

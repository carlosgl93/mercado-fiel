import { db } from '@/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ScheduleAppointmentParams } from './scheduleAppointmentMutation';
import { PaginationModel } from '@/store/backoffice/payments';

export const getAllAppointments = async (
  paginationModel: PaginationModel,
  lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null,
) => {
  const { pageSize, page } = paginationModel;
  const appointmentsRef = collection(db, 'appointments');

  let q;

  if (page === 0) {
    lastDoc = null;
  }

  if (!lastDoc) {
    // For the first page, don't use startAfter
    q = query(appointmentsRef, orderBy('createdAt'), limit(pageSize));
  } else {
    // For subsequent pages, start after the last document from the previous page
    q = query(appointmentsRef, orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
  }

  const querySnapshot = await getDocs(q);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    appointments: querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ScheduleAppointmentParams[],
    lastVisible,
  };
};

import { db } from '@/firebase';
import { Patient } from '@/pages/RegistrarUsuario/RegistrarUsuarioController';
import { Recurrency } from '@/utils/getRecurrencyText';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';

export type Apoyo = {
  id?: string;
  title: string;
  userId: string;
  serviceName: string;
  specialityName: string;
  description: string;
  forWhom: string;
  address: string;
  comunasIds: number[];
  recurrency: Recurrency;
  sessionsPerRecurrency: string;
  patientName: string;
  patientAge: number;
  patientRut: string;
  withNewPatient: boolean;
};

const createNewPatient = (data: Apoyo): Patient => ({
  name: data.patientName,
  age: data.patientAge,
  rut: data.patientRut,
  service: data.serviceName,
  speciality: data.specialityName,
});

const validatePatientData = (data: Apoyo) => {
  if (!data.patientName || !data.patientAge || !data.patientRut) {
    throw new Error('Patient data is required');
  }
};

const addNewPatientToUser = async (userId: string, newPatient: Patient) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    pacientes: arrayUnion(newPatient),
  });
};

const addSupportRequestToCollection = async (data: Apoyo) => {
  const newSupport = await addDoc(collection(db, 'supportRequests'), {
    ...data,
    timestamp: Timestamp.now(),
  });
  return newSupport.id;
};

export const addSupportRequest = async (data: Apoyo) => {
  try {
    if (data.withNewPatient) {
      validatePatientData(data);
      const newPatient = createNewPatient(data);
      await addNewPatientToUser(data.userId, newPatient);
    }

    const supportRequestId = await addSupportRequestToCollection(data);
    return {
      id: supportRequestId,
      ...data,
    };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

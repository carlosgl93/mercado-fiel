/**;
 * Creates a prestador in firebase auth and firestore
 * @param  Params
 * @returns  Returns the same prestador
 *
 */

import { Comuna, Especialidad, Servicio } from '@/types';
import { defaultAvailability } from '@/utils/constants';
import dayjs from 'dayjs';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
} from 'firebase/auth';
import { db, auth } from '@/firebase/firebase';
import { query, collection, where, getDocs, doc, setDoc, writeBatch, or } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { Prestador } from '@/store/auth/prestador';

export type CreatePrestadorParams = {
  nombre: string;
  apellido: string;
  rut: string;
  // telefono: string;
  correo: string;
  contrasena: string;
  comunas: Comuna[];
  servicio: Servicio | undefined;
  acceptedTerms: boolean;
  especialidad: Especialidad | undefined;
};

export async function createPrestador({
  nombre,
  apellido,
  rut,
  correo,
  contrasena,
  comunas,
  servicio,
  especialidad,
}: CreatePrestadorParams) {
  const userRutQuery = query(
    collection(db, 'users'),
    or(where('rut', '==', rut), where('email', '==', correo)),
  );
  const providerRutQuery = query(
    collection(db, 'providers'),
    or(where('rut', '==', rut), where('email', '==', correo)),
  );
  try {
    const userRutSnapshot = await getDocs(userRutQuery);
    const providerRutSnap = await getDocs(providerRutQuery);
    if (!userRutSnapshot.empty) {
      throw new Error('Este rut o email ya tiene una cuenta de usuario.');
    }
    if (!providerRutSnap.empty) {
      throw new Error('Este rut o email ya tiene una cuenta de proveedor.');
    }
  } catch (error) {
    return Promise.reject(error);
  }
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredentials = await createUserWithEmailAndPassword(auth, correo, contrasena);
    const { user } = userCredentials;
    await sendEmailVerification(user);
    const newPrestador: Prestador = {
      email: correo,
      id: user.uid,
      role: 'prestador',
      firstname: nombre,
      lastname: apellido,
      rut,
      comunas: comunas,
      servicio: servicio?.serviceName || '',
      especialidad: especialidad?.especialidadName || '',
      offersFreeMeetAndGreet: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      verified: false,
      profileImageUrl: '',
      settings: {
        servicios: false,
        detallesBasicos: false,
        disponibilidad: false,
        comunas: true,
        experiencia: false,
        cuentaBancaria: false,
        historialLaboral: false,
        educacionFormacion: false,
        registroSuperIntendenciaSalud: false,
        insignias: false,
        inmunizacion: false,
        idiomas: false,
        antecedentesCulturales: false,
        religion: false,
        interesesHobbies: false,
        sobreMi: false,
        misPreferencias: false,
      },
    };
    const providerRef = doc(db, 'providers', user.uid);
    return setDoc(providerRef, newPrestador).then(() => {
      const batch = writeBatch(db);
      defaultAvailability.forEach((day) => {
        const dayRef = doc(providerRef, 'availability', day.day);
        batch.set(dayRef, day);
      });

      return batch.commit().then(() => newPrestador);
    });
  } catch (error) {
    let message = 'Hubo un error creando el prestador: ';
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message += 'El correo electrónico ya está en uso.';
          break;
        case 'auth/invalid-email':
          message += 'El correo electrónico no es válido.';
          break;
        case 'auth/operation-not-allowed':
          message += 'La operación no está permitida.';
          break;
        case 'auth/weak-password':
          message += 'La contraseña es demasiado débil.';
          break;
        default:
          message += error.message;
      }
    }
    return Promise.reject(new Error(message));
  }
}

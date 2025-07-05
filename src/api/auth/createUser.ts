/**;
 * Creates a user in firebase auth and firestore
 * @param  user data
 * @returns  Returns the same user
 *
 */

import { auth, db } from '@/firebase';
import { Patient } from '@/pages/RegistrarUsuario/RegistrarUsuarioController';
import { User } from '@/store/auth/user';
import { Comuna, Especialidad, Servicio } from '@/types';
import dayjs from 'dayjs';
import { FirebaseError } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from 'firebase/auth';
import { query, collection, where, getDocs, doc, setDoc, or } from 'firebase/firestore';

export type CreateUserParams = {
  nombre: string;
  apellido: string;
  paraQuien: ForWhom;
  nombrePaciente?: string;
  rut: string;
  comuna: Comuna;
  correo: string;
  contrasena: string;
  acceptedTerms: boolean;
  pacientes?: Patient[];
  servicio: Pick<Servicio, 'serviceName'>;
  especialidad?: Pick<Especialidad, 'especialidadName'>;
};

export type ForWhom = 'paciente' | 'tercero' | '';

const defaultNewUser = { dob: '', phone: '', gender: '', address: '' };

export async function createUser({
  nombre,
  apellido,
  paraQuien,
  rut,
  correo,
  contrasena,
  comuna,
  acceptedTerms,
  servicio,
  especialidad,
  pacientes = [],
}: CreateUserParams) {
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
    const { user } = await createUserWithEmailAndPassword(auth, correo, contrasena);
    localStorage.setItem('token', JSON.stringify(user.refreshToken));

    const newUser: User = {
      ...defaultNewUser,
      email: correo.toLowerCase(),
      id: user.uid,
      role: 'user',
      firstname: nombre,
      lastname: apellido,
      forWhom: paraQuien,
      rut,
      gender: '',
      comuna: comuna,
      acceptedTerms,
      service: servicio.serviceName,
      speciality: especialidad?.especialidadName || '',
      pacientes: paraQuien === 'paciente' ? [] : pacientes,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    const userRef = doc(db, 'users', user.uid);
    return await setDoc(userRef, newUser).then(() => newUser);
  } catch (error) {
    if (error instanceof FirebaseError) {
      let message = 'Hubo un error creando tu cuenta: ';

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
      return Promise.reject(new Error(message));
    }
  }
}

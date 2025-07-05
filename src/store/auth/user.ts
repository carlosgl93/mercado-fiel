import { Patient } from '@/pages/RegistrarUsuario/RegistrarUsuarioController';
import { Comuna } from '@/types';
import { atom } from 'recoil';

export interface User {
  comuna?: Comuna;
  email: string;
  id: string;
  role: 'admin' | 'user' | 'prestador' | '';
  firstname: string;
  lastname: string;
  forWhom: string;
  patientName?: string;
  rut: string;
  isLoggedIn?: boolean;
  gender: 'Masculino' | 'Femenino' | 'Otro' | '';
  dob: string;
  phone: string;
  address: string;
  token?: string;
  acceptedTerms: boolean;
  service: string;
  speciality: string;
  profileImageUrl?: string;
  age?: number;
  patientAge?: number;
  pacientes?: Patient[];
  createdAt?: string;
}

export const userState = atom<null | User>({
  key: 'userState', // unique ID (with respect to other atoms/selectors)
  default: null,
});

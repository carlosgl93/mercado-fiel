import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';
import { Comuna } from './Comuna';

export interface Prestador {
  email: string;
  id: string;
  role: string;
  firstname?: string;
  lastname?: string;
  rut: string;
  comunas: Comuna[];
  servicio: string | undefined;
  especialidad?: string | undefined;
  telefono?: string;
  isLoggedIn?: boolean;
  availability?: AvailabilityData[];
  averageReviews?: number;
  description?: string;
  totalReviews?: number;
  offersFreeMeetAndGreet: boolean;
  imageUrl?: string;
  gender?: string;
  dob?: string;
  address?: string;
  createdAt: string;
  verified: boolean;
  settings: {
    servicios: boolean;
    detallesBasicos: boolean;
    disponibilidad: boolean;
    comunas: boolean;
    experiencia: boolean;
    cuentaBancaria: boolean;
    historialLaboral: boolean;
    educacionFormacion: boolean;
    registroSuperIntendenciaSalud: boolean;
    insignias: boolean;
    inmunizacion: boolean;
    idiomas: boolean;
    antecedentesCulturales: boolean;
    religion: boolean;
    interesesHobbies: boolean;
    sobreMi: boolean;
    misPreferencias: boolean;
  };
}

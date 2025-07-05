import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';
import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import { Comuna } from '@/types';
import { atom } from 'recoil';

export interface Prestador {
  email: string;
  id: string;
  role: string;
  firstname?: string;
  lastname?: string;
  rut: string;
  comunas: Comuna[];
  servicio: string;
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
  createdServicios?: UserCreatedServicio[];
  createdAt?: string;
  verified?: boolean | 'Verificado' | 'Verificando' | 'Rechazado';
  profileImageUrl: string;
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
export const defaultPrestador = {
  email: '',
  id: '',
  role: '',
  firstname: '',
  lastname: '',
  rut: '',
  comunas: [],
  tarifas: [],
  servicio: '',
  especialidad: '',
  verified: false,
  createdAt: '',
  availability: [
    {
      id: 0,
      day: 'Lunes',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 1,
      day: 'Martes',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 2,
      day: 'Miércoles',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 3,
      day: 'Jueves',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 4,
      day: 'Viernes',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 5,
      day: 'Sábado',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
    {
      id: 6,
      day: 'Domingo',
      times: {
        startTime: '00:00',
        endTime: '00:00',
      },
      isAvailable: true,
    },
  ],
  averageReviews: 0,
  totalReviews: 0,
  description: '',
  offersFreeMeetAndGreet: false,
  profileImageUrl: '',
  settings: {
    servicios: false,
    detallesBasicos: false,
    disponibilidad: false,
    comunas: false,
    tarifas: false,
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

export const prestadorState = atom<null | Prestador>({
  key: 'prestadorState',
  default: defaultPrestador,
});

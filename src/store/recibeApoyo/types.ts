import { ForWhom } from '@/api/auth';
import { Comuna } from '@/types/Comuna';
import { Prestador } from '@/types/Prestador';
import { Especialidad, Servicio } from '@/types/Servicio';

type Actions = {
  addComuna: (comuna: Comuna) => void;
  removeComuna: (comuna: Comuna) => void;
  increaseStep: () => void;
  selectForWhom: (forWhom: ForWhom) => void;
  selectServicio: (servicio: Servicio | null) => void;
  selectEspecialidad: (especialidad: Especialidad | undefined) => void;
  decreaseStep: () => void;
  // filterByServicio: (servicio: Service) => void;
  setAvailability: (availability: { id: number; name: string }) => void;
  setServicios: (servicios: Servicio[]) => void;
  setComunas: (comunas: Comuna[]) => void;
  setPrestadores: (prestadores: Prestador[]) => void;
  resetRecibeApoyoState: () => void;
  resetComuna: () => void;
  resetServicio: () => void;
};

export type { Actions };

import { Comuna } from '@/types/Comuna';
import { Especialidad, Servicio } from '@/types/Servicio';

type Actions = {
  addComuna: (comuna: Comuna) => void;
  removeComuna: (comuna: Comuna) => void;
  increaseStep: () => void;
  selectServicio: (servicio: Servicio) => void;
  selectEspecialidad: (especialidad: Especialidad) => void;
  decreaseStep: () => void;
  resetEntregaApoyoState: () => void;
};

export type { Actions };

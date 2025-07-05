import { UserState } from '.';

type Actions = {
  login: (userData: UserState) => void;
  logout: () => void;
  register: (userData: UserState) => void;
  comunasSelected: (comunas: string[]) => void;
  selectServicio: (servicio: string) => void;
  selectEspecialidad: (especialidad: string) => void;
};

export type { Actions };

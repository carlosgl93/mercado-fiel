import { Prestador } from '@/types/Prestador';
import { User } from '@/types/User';

type Actions = {
  login: (email: string, password: string) => void;
  createUser: (user: User) => void;
  logout: () => void;
  redirectAfterLogin: () => void;
  updateRedirectToAfterLogin: (path: string) => void;
  createPrestador: (prestador: Prestador) => void;
};

export type { Actions };

import { atom, useRecoilState } from 'recoil';

import type { Actions } from './types';

export type UserState = {
  name: string;
  email: string;
  phone: string;
  comunas: string[];
  servicio: string;
  selectedEspecialidad: string;
};
const userState = atom<UserState>({
  key: 'user-state',
  default: {
    name: '',
    email: '',
    phone: '',
    comunas: [],
    servicio: '',
    selectedEspecialidad: '',
  },
});

function useUser(): [UserState, Actions] {
  const [user, setUser] = useRecoilState(userState);

  const comunasSelected = (comunas: string[]) => {
    setUser((prev) => ({
      ...prev,
      comunas: comunas,
    }));
  };
  const selectServicio = (servicio: string) => {
    setUser((prev) => ({
      ...prev,
      servicio,
    }));
  };

  const selectEspecialidad = (especialidad: string) => {
    setUser((prev) => ({
      ...prev,
      selectedEspecialidad: especialidad,
    }));
  };

  // implement login
  const login = (userData: UserState) => {
    console.log('user data from login', userData);
    // TODO: GET USER FROM API/DATABASE
    setUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      comunas: userData.comunas,
      servicio: userData.servicio,
      selectedEspecialidad: userData.selectedEspecialidad,
    });
  };
  // implement logout
  const logout = () => {
    setUser({
      name: '',
      email: '',
      phone: '',
      comunas: [],
      servicio: '',
      selectedEspecialidad: '',
    });
  };
  // implement register
  const register = (userData: UserState) => {
    console.log('user data from register', userData);
    // TODO: IMPLEMENT REGISTER
  };

  return [user, { login, register, logout, comunasSelected, selectServicio, selectEspecialidad }];
}

export default useUser;

import { atom } from 'recoil';

export const defaultServicio = {
  especialidad: '',
  nombreServicio: '',
  tarifa: '',
  description: '',
  isCreatingServicio: false,
  duration: 15,
};

export const servicioState = atom({
  key: 'servicioState',
  default: defaultServicio,
});

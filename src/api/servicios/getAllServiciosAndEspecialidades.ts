import { selector } from 'recoil';
import api from '../api';

export const getAllServiciosAndEspecialidades = selector({
  key: 'getAllServiciosAndEspecialidades',
  get: async () => {
    try {
      const response = await api.get(`/servicios`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
});

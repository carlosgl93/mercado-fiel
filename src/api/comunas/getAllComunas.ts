import { selector } from 'recoil';
import api from '../api';

export const getAllComunas = selector({
  key: 'getAllComunas',
  get: async () => {
    try {
      const response = await api.get(`/comunas`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
});

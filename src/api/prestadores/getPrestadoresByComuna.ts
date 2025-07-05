import { selectorFamily } from 'recoil';
import api from '../api';

export const getPrestadoresByComuna = selectorFamily({
  key: 'prestadoresByComuna',
  get: (comuna: string) => async () => {
    const response = await api.get(`/prestadores`, {
      params: {
        comuna,
      },
    });

    console.log(response);
    return response.data;
  },
});

import { selectorFamily } from 'recoil';
import api from '../api';

export const getPrestadoresByComunaAndServicio = selectorFamily({
  key: 'prestadoresByComunaAndServicio',
  get:
    (filters: { comuna: number | null | undefined; servicio: number | null | undefined }) =>
    async () => {
      try {
        console.log('getting prestadores');
        const response = await api.get(`/prestadores`, {
          params: {
            comuna: filters.comuna,
            servicio: filters.servicio,
          },
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
});

import api from '../api';
import { DisponibilidadFromFront } from './getDisponibilidadByPrestadorId';

export const postDisponibilidad = async (newDisponibilidad: DisponibilidadFromFront[]) => {
  try {
    const response = await api.post('/disponibilidad', { newDisponibilidad });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

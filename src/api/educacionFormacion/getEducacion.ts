import { AxiosError } from 'axios';
import api from '../api';

export const getEducacion = async (prestadorId: string) => {
  try {
    const readEducacion = await api.get('/educacion', {
      params: { prestadorId },
    });

    if (readEducacion.data === '') return undefined;
    return readEducacion.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new AxiosError(error.response?.data);
    }
    throw error;
  }
};

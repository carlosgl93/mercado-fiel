import { AxiosError } from 'axios';
import api from '../api';
import { EducacionInputs } from '@/pages/ConstruirPerfil/EducacionFormacion/EducacionFormacion';

export interface SaveEducacion extends EducacionInputs {
  prestadorId: string;
}

export const postEducacion = async (data: SaveEducacion[]) => {
  try {
    const saveEducacion = await api.post('/educacion', data);
    return saveEducacion.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new AxiosError(error.response?.data);
    }
    throw error;
  }
};

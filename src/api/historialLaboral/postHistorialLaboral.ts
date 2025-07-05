import { AxiosError } from 'axios';
import api from '../api';
import { HistorialLaboralEntry } from '@/hooks/useHistorialLaboral';

export interface SaveHistorialLaboral extends HistorialLaboralEntry {
  prestadorId: string;
}

export const postHistorialLaboral = async (data: SaveHistorialLaboral[]) => {
  try {
    const saveHistorialLaboral = await api.post('/historialLaboral', data);
    return saveHistorialLaboral.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new AxiosError(error.response?.data);
    }
    throw error;
  }
};

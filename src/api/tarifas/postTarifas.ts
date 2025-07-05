import { TarifaFront } from '@/types';
import api from '../api';

export const postTarifas = async (prestadorId: string, tarifas: TarifaFront[]) => {
  const response = await api.post(`/tarifas`, {
    prestadorId,
    tarifas,
  });
  return response.data.message;
};

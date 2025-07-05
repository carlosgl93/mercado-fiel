import { Prestador } from '@/types/Prestador';
import api from '../api';

type PostPrestadorData = {
  message: string;
  prestador: Partial<Prestador>;
};

export const postPrestador = async (prestador: Partial<Prestador>): Promise<PostPrestadorData> => {
  try {
    const response = await api.post('/prestadores', prestador);
    console.log(response, 'RESPONSE FROM PRESTADORES CREATE');
    return response.data;
  } catch (error) {
    console.log('error creating prestador');
    console.log(error);
    return {
      message: 'Error al crear prestador',
      prestador,
    };
  }
};

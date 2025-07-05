import { AxiosError } from 'axios';
import api from '../api';

export const deleteEducacion = async (id: number) => {
  try {
    const deleteEducacion = await api.delete(`/educacion/${id}`);
    return deleteEducacion.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new AxiosError(error.response?.data);
    }
    throw error;
  }
};

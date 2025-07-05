import api from '../api';

export const deleteHistorialEntry = async (id: number) => {
  const deleteHistorialEntry = await api.delete(`/historialLaboral/${id}`);

  return deleteHistorialEntry.data;
};

import api from '../api';

export const removePrestadorComuna = async (prestadorId: string, comunaId: number) => {
  const removeComuna = await api.delete('/prestador/comuna', {
    params: {
      prestadorId,
      comunaId,
    },
  });
  return removeComuna.data;
};

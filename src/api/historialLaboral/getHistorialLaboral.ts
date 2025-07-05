import api from '../api';

type BackendHistorialEntry = {
  id: number;
  empresa: string;
  inicio: string;
  final: string;
  titulo: string;
  todavia: boolean;
};

export const getHistorialLaboral = async (prestadorId: string) => {
  const readHistorialLaboral = await api.get('/historialLaboral', {
    params: { prestadorId },
  });

  if (readHistorialLaboral.data === '') return undefined;
  return readHistorialLaboral.data?.sort((a: BackendHistorialEntry, b: BackendHistorialEntry) => {
    if (a.todavia && !b.todavia) {
      return -1;
    } else if (!a.todavia && b.todavia) {
      return 1;
    } else {
      return new Date(b.final).getTime() - new Date(a.final).getTime();
    }
  });
};

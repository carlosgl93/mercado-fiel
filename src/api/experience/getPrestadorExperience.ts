import api from '../api';

export const getPrestadorExperience = async (prestadorId: string) =>
  await api.get(`experience/${prestadorId}`).then((res) => res.data);

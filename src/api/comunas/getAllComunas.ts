import { ComunaDB, mapComunaDBToComuna } from '../../models/Comuna';
import api from '../api';

export const getAllComunas = async () => {
  const res = await api.get('/comunas');

  return res.data.data.map((c: ComunaDB) => mapComunaDBToComuna(c));
};

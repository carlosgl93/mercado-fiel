import { atom } from 'recoil';
import { Prestador } from '../auth/prestador';

export const interactedPrestadorState = atom<Prestador | null>({
  key: 'interactedPrestadorState',
  default: null,
});

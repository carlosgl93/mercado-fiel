import { Comuna } from '@/types';
import { atom } from 'recoil';

export const comunasState = atom<Comuna[]>({
  key: 'comunasState',
  default: [],
});

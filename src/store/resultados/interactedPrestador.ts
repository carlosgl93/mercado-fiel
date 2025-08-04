import { atom } from 'recoil';
import { Supplier } from '../../models';

export const interactedProveedorState = atom<Supplier | null>({
  key: 'interactedProveedorState',
  default: null,
});

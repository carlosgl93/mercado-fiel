import { Customer } from '@/models';
import { atom } from 'recoil';

export const userState = atom<null | Customer>({
  key: 'userState',
  default: null,
});

// Re-export types for backward compatibility
export type { Customer as User };

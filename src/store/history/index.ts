import { atom } from 'recoil';

// Create a Recoil atom to store the navigation history
export const navigationHistoryState = atom<string[]>({
  key: 'navigationHistoryState',
  default: [],
});

import { atom } from 'recoil';
import { UserLookingFor } from '../../hooks/useUserLookingFor';

export const userLookingForState = atom<UserLookingFor | null>({
  key: 'userLookingForState',
  default: null,
});

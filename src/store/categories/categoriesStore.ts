import { atom } from 'recoil';
import { Category } from '../../hooks/useCategories';

export const categoryState = atom<Category>({
  key: 'categoryState',
  default: {
    id: '',
    name: '',
  },
});

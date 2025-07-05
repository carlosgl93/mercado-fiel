import { atom } from 'recoil';

export const usersGridPaginationModelState = atom<{
  pageSize: number;
  page: number;
}>({
  key: 'usersGridPaginationModelState',
  default: {
    pageSize: 10,
    page: 0,
  },
});

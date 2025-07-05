import { PaymentRecord } from '@/api/appointments';
import { atom } from 'recoil';

export type PaginationModel = {
  pageSize: number;
  page: number;
};

export const paymentsGridPaginationModelState = atom<{
  pageSize: number;
  page: number;
}>({
  key: 'paymentsGridPaginationModelState',
  default: {
    pageSize: 10,
    page: 0,
  },
});

export const showPaymentsDetailsState = atom<boolean>({
  key: 'showPaymentsDetailsState',
  default: false,
});

export const paymentDetailsParamsState = atom<PaymentRecord | null>({
  key: 'paymentDetailsParamsState',
  default: null,
});

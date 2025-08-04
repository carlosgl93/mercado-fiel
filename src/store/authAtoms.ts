import { atom } from 'recoil';
import { AuthCustomer, AuthState, AuthSupplier, AuthUser } from '../types/auth';

// Main auth state
export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    customer: null,
    supplier: null,
    isInitialized: false,
    isLoading: false,
  },
});

// Individual atoms for easier access
export const authUserState = atom<AuthUser | null>({
  key: 'authUserState',
  default: null,
});

export const authCustomerState = atom<AuthCustomer | null>({
  key: 'authCustomerState',
  default: null,
});

export const authSupplierState = atom<AuthSupplier | null>({
  key: 'authSupplierState',
  default: null,
});

export const authInitializedState = atom<boolean>({
  key: 'authInitializedState',
  default: false,
});

export const authLoadingState = atom<boolean>({
  key: 'authLoadingState',
  default: false,
});

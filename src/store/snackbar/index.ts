import { atom } from 'recoil';

export interface NotificationState {
  open: boolean;
  message?: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  action?: JSX.Element;
  persist?: boolean;
}

export const notificationState = atom<NotificationState>({
  key: 'notificationState',
  default: { open: false, message: '', severity: 'success', action: undefined, persist: false },
});

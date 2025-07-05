import { useRecoilState } from 'recoil';
import { notificationState } from '.';

export const useSnackbarController = () => {
  const [notification, setNotification] = useRecoilState(notificationState);

  const onClose = () => {
    setNotification(() => {
      return {
        ...notification,
        open: false,
      };
    });
  };

  return {
    onClose,
  };
};

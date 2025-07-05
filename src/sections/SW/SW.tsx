import { useCallback, useEffect } from 'react';

import Button from '@mui/material/Button';

import { useRegisterSW } from 'virtual:pwa-register/react';

import useNotifications from '@/store/notifications';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';

function SW() {
  const setNotification = useSetRecoilState(notificationState);
  const [, notificationsActions] = useNotifications();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setNotification((prev) => ({ ...prev, open: false }));
  }, [setOfflineReady, setNeedRefresh, notificationsActions]);

  useEffect(() => {
    if (offlineReady) {
      console.log('offlineReady');
      // setNotification({
      //   open: true,
      //   message: 'Puedes instalar esta web!',
      //   severity: 'success',
      //   action: (
      //     <Button
      //       onClick={() => {
      //         close();
      //         setNotification((prev) => ({ ...prev, open: false }));
      //       }}
      //     >
      //       Cerrar
      //     </Button>
      //   ),
      // });
    } else if (needRefresh) {
      console.log('needRefresh');
      setNotification({
        open: true,
        message: 'Hay una nueva versión disponible, haz click en el botón para actualizar.',
        severity: 'success',
        persist: true,
        action: (
          <Button
            onClick={() => {
              updateServiceWorker(false);
              caches
                .keys()
                .then((cacheNames) => {
                  cacheNames.forEach((cacheName) => {
                    caches.delete(cacheName);
                  });
                })
                .then(() => {
                  window.location.reload();
                });
              setNotification((prev) => ({ ...prev, open: false }));
              close();
            }}
          >
            Actualizar
          </Button>
        ),
      });
    }
  }, [close, needRefresh, offlineReady, notificationsActions, updateServiceWorker]);

  return null;
}

export default SW;

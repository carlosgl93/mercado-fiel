import { sendEmailApi } from '@/api';
import { Prestador } from '@/store/auth/proveedor';
import { NotificationState } from '@/store/snackbar';
import { QueryClient } from 'react-query';
import { SetterOrUpdater } from 'recoil';

/**;
 *
 * @param  prestador received from the mutation
 * @param  client useQueryClient instance
 * @param setNotification setter to trigger new notification
 *
 * @returns  triggers sendEmail returning status 200 | 400 | 500
 *
 */

export function onSuccessVerifyPrestador(
  prestador: Prestador,
  client: QueryClient,
  setNotification: SetterOrUpdater<NotificationState>,
) {
  client.invalidateQueries(['allPrestadores']);
  setNotification({
    open: true,
    message: 'Prestador confirmado',
    severity: 'success',
  });
  sendEmailApi.post('/', {
    firstname: prestador.firstname,
    templateName: 'verify-prestador.html',
    options: {
      from: 'Mercado Fiel <contacto@mercadofiel.cl>',
      to: prestador?.email,
      subject: 'Tu perfil ha sido verificado!',
      text: `${
        prestador?.firstname ? prestador?.firstname : prestador?.email
      } tu perfil ha sido aprobado. Ahora apareceras en las busquedas en Mercado Fiel.`,
    },
  });
}

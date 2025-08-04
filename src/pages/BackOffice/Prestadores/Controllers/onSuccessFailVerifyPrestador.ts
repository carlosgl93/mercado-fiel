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

// Confusing naming... handler for the onSuccess effect of the failed verify mutation.
export function onSuccessFailedVerifyPrestador(
  prestador: Prestador,
  client: QueryClient,
  setNotification: SetterOrUpdater<NotificationState>,
) {
  client.invalidateQueries(['allPrestadores']);
  setNotification({
    open: true,
    message: 'Prestador rechazado',
    severity: 'success',
  });
  sendEmailApi.post('/', {
    firstname: prestador.firstname,
    templateName: 'failed-verify-prestador.html',
    options: {
      from: 'Mercado Fiel <contacto@mercadofiel.cl>',
      to: prestador?.email,
      subject: 'Tu perfil ha sido rechazado!',
      text: `Estimado/a ${
        prestador?.firstname ? prestador.firstname : prestador?.email
      } hemos rechazado tu perfil dado que no figuras en la base de datos de prestadores de salud de chile.`,
    },
  });
}

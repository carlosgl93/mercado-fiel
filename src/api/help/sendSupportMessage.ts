/**;
 *
 * @param sendSupportMessageParams: {
 * nombre: string;
 * email: string;
 * mensaje: string;
 * }
 * @returns  void;
 *
 */

import { sendEmailApi } from '../sendEmailApi';
import { email as customerSupportEmail } from '@/config';

type TSendSupportMessage = {
  nombre: string;
  email: string;
  mensaje: string;
};

export async function sendSupportMessage({ nombre, email, mensaje }: TSendSupportMessage) {
  try {
    await sendEmailApi.post('/', {
      senderName: nombre,
      senderEmail: email,
      templateName: 'send-support-email.html',
      message: mensaje,
      options: {
        from: 'Mercado Fiel <contacto@mercadofiel.cl>',
        to: customerSupportEmail,
        subject: `${nombre} necesita ayuda en Mercado Fiel!`,
        text: `${nombre} necesita ayuda en Mercado Fiel!`,
      },
    });
  } catch (error) {
    throw new Error('Error al enviar el mensaje de soporte');
  }
}

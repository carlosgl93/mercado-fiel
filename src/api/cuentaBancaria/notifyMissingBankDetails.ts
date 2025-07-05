/**;
 *
 * @param providerName
 * @param providerEmail
 * @returns  void
 *
 */

import { sendEmailApi } from '../sendEmailApi';

export async function notifyMissingBankDetails({
  providerName,
  providerEmail,
}: {
  providerName: string;
  providerEmail: string;
}) {
  try {
    console.log(providerName);
    await sendEmailApi.post('/', {
      recipientName: providerName || 'Estimado',
      templateName: 'bank-details-missing.html',
      options: {
        from: 'Mercado Fiel <contacto@mercadofiel.cl>',
        to: providerEmail,
        subject: 'Agrega tus datos bancarios!',
        text: 'Agrega tus datos bancarios!',
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

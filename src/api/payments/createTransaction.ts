/**;
 *
 * @param appointment Object containing the service, provider, customer, scheduledDate and scheduledTime
 * @returns an object of the type: CreatedTransaction with the URL to send the user to the payment provider
 *
 */

import { paymentSettings } from '@/config';
import { v4 as uuidv4 } from 'uuid';
import paykuApi from '../paykuApi';
import { CreatedTransaction } from './payku/models';

export async function createTransaction(paykuParams: {
  totalToPay: number;
  sessionsToConfirm: number;
}): Promise<CreatedTransaction> {
  const { totalToPay, sessionsToConfirm } = paykuParams;

  if (!totalToPay) {
    throw new Error('Missing total price to pay');
  }

  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const notifyUrl: string = import.meta.env.VITE_PAYMENT_NOTIFY_URL;
  const orderId = uuidv4();

  // const appsIds = appointments.map((a) => a.id); // ['id1', 'id2', 'id3'];
  // const idsToConfirm = appsIds.slice(0, sessionsToConfirm); // ['id1', 'id2'];
  // const jointIds = idsToConfirm.join('-'); // 'id1-id2';
  // const urlReturn = `${baseUrl}/payment?appointmentsIds=${jointIds}`;

  try {
    const paykuRes = await paykuApi.post('/transaction', {
      // email: appointments[0]?.customer?.email,
      order: orderId,
      subject: 'Pago por servicio de sesión',
      // subject: `Pago por servicio de ${appointments[0]?.servicio?.name} al prestador ${appointments[0].provider.firstname} ${appointments[0].provider.lastname}`,
      amount: Math.round(+totalToPay * paymentSettings.appCommission),
      currency: paymentSettings.currency,
      payment: paymentSettings.paymentMethods,
    });

    console.log({ paykuRes });

    return paykuRes.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
}

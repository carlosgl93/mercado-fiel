/**;
 *
 * @param  id: transaction id from payku
 * @returns  Returns
 *
 */

import paykuApi from '@/api/paykuApi';
import { PaykuTransaction } from './models';

export async function getPaykuTransaction(id: string): Promise<PaykuTransaction> {
  const paykuTransaction: PaykuTransaction = await paykuApi.get(`/transaction/${id}`);
  return paykuTransaction;
}

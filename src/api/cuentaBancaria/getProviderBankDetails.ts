/**;
 *
 * @param providerId: string
 * @returns  Returns
 *
 */

import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type BankAccount = {
  id: string;
  banco: string;
  numeroCuenta: string;
  rut: string;
  tipoCuenta: string;
  titular: string;
};

export async function getProviderBankDetails(providerId: string | undefined): Promise<BankAccount> {
  if (!providerId) {
    throw new Error('no provider id!');
  }

  const docRef = doc(db, 'bankAccounts', providerId);

  try {
    const details = await getDoc(docRef);
    return details.data() as BankAccount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**;
 *
 * @param  Params
 * @returns  Returns
 *
 */

import { Customer, CustomerDB } from '../../models';
import api from '../api';
import { mapDBCustomer } from './mapDBCustomer';

export async function getCustomers(page: number, limit: number) {
  const res = await api.get('/customers', {
    params: {
      page,
      limit,
    },
  });

  const customers: Customer[] = res.data.map((dbCustomer: CustomerDB) => {
    console.log('Mapping DB customer:', dbCustomer);
    return mapDBCustomer(dbCustomer);
  });
  return customers;
}

/**;
 *
 * @param  Params
 * @returns  Returns
 *
 */

import { Category } from '../../hooks';
import { Comuna, CustomerDB } from '../../models';
import api from '../api';
import { mapDBCustomer } from './mapDBCustomer';

export async function getCustomers(
  page: number,
  limit: number,
  selectedComunas: Comuna | undefined,
  selectedCategory: Category,
) {
  const res = await api.get('/customers', {
    params: {
      page,
      limit,
      comunaId: selectedComunas?.id,
      category: selectedCategory.id,
    },
  });

  return res.data.data.map((dbCustomer: CustomerDB) => mapDBCustomer(dbCustomer));
}

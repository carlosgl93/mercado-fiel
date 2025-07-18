/**;
 *
 * @param page: number, limit: number
 * @returns  Returns
 *
 */

import api from '../api';

export async function getSuppliers(page: number, limit: number) {
  const res = await api.get('/suppliers', {
    params: {
      page,
      limit,
    },
  });

  console.log('getSuppliers response:', res.data);
  return res.data;
}

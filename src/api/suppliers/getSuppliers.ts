/**;
 *
 * @param page: number, limit: number
 * @returns  Returns
 *
 */

import { Category } from '../../hooks';
import { Comuna, Supplier } from '../../models';
import { mapDBSupplier, SupplierDB } from '../../models/Supplier';
import api from '../api';

export async function getSuppliers(
  page: number,
  limit: number,
  selectedComunas: Comuna | undefined,
  selectedCategory: Category | undefined,
): Promise<Supplier[]> {
  const res = await api.get('/suppliers', {
    params: {
      page,
      limit,
      comunas: selectedComunas?.id,
      category: selectedCategory?.id,
    },
  });

  return res.data.data.map((s: SupplierDB) => mapDBSupplier(s));
}

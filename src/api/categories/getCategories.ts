/**;
 *
 * @returns  Returns all db categories
 *
 */

import { CategoryDB, mapDBCategoryToCategory } from '../../models/Category';
import api from '../api';

export async function getCategories() {
  try {
    const res = await api.get('/categories/');
    return res.data.data.map((category: CategoryDB) => mapDBCategoryToCategory(category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

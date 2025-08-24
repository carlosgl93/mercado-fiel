import {
  CategoriesListResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api/categories';
import { mapCategoryFromApi, mapCategoryToApi } from '@/utils/caseMapping';
import api from './api';

const CATEGORIES_ENDPOINT = '/categories';

export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<CategoriesListResponse> => {
    const response = await api.get(CATEGORIES_ENDPOINT);
    return {
      success: response.data.success,
      data: response.data.data.map(mapCategoryFromApi),
    };
  },

  // Get category by ID
  getCategory: async (id: number): Promise<CategoryResponse> => {
    const response = await api.get(`${CATEGORIES_ENDPOINT}/${id}`);
    return {
      success: response.data.success,
      data: mapCategoryFromApi(response.data.data),
    };
  },

  // Create new category
  createCategory: async (categoryData: CreateCategoryRequest): Promise<CategoryResponse> => {
    const mappedData = mapCategoryToApi(categoryData);
    const response = await api.post(CATEGORIES_ENDPOINT, mappedData);
    return {
      success: response.data.success,
      data: mapCategoryFromApi(response.data.data),
    };
  },

  // Update category
  updateCategory: async (
    id: number,
    categoryData: UpdateCategoryRequest,
  ): Promise<CategoryResponse> => {
    const mappedData = mapCategoryToApi(categoryData);
    const response = await api.put(`${CATEGORIES_ENDPOINT}/${id}`, mappedData);
    return {
      success: response.data.success,
      data: mapCategoryFromApi(response.data.data),
    };
  },

  // Delete category
  deleteCategory: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${CATEGORIES_ENDPOINT}/${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  },
};

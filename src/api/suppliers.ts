import { SupplierResponse, SuppliersListResponse, UpdateBusinessRequest } from '@/types/supplier';
import { objectToCamelCase, objectToSnakeCase } from '@/utils/caseMapping';
import api from './api';

const SUPPLIERS_ENDPOINT = '/suppliers';

export const suppliersApi = {
  // Get suppliers with pagination and filters
  getSuppliers: async (
    page = 1,
    limit = 10,
    comuna?: any,
    category?: any,
  ): Promise<SuppliersListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (comuna) {
      params.append('comuna', comuna.toString());
    }

    if (category) {
      params.append('category', category.toString());
    }

    const response = await api.get(`${SUPPLIERS_ENDPOINT}?${params}`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : null,
      message: response.data.message,
    };
  },

  // Get supplier by ID
  getSupplier: async (id: number): Promise<SupplierResponse> => {
    const response = await api.get(`${SUPPLIERS_ENDPOINT}/${id}`);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Update business information
  updateBusiness: async (
    id: number,
    businessData: UpdateBusinessRequest,
  ): Promise<SupplierResponse> => {
    const mappedData = objectToSnakeCase(businessData);
    const response = await api.patch(`${SUPPLIERS_ENDPOINT}/${id}/business`, mappedData);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Get current supplier (authenticated user)
  getCurrentSupplier: async (): Promise<SupplierResponse> => {
    const response = await api.get(`${SUPPLIERS_ENDPOINT}/me`);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Search suppliers
  searchSuppliers: async (filters: {
    searchTerm?: string;
    category?: string;
    region?: string;
    comuna?: string;
    page?: number;
    limit?: number;
  }): Promise<SuppliersListResponse> => {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append('q', filters.searchTerm);
    if (filters.category) params.append('category', filters.category);
    if (filters.region) params.append('region', filters.region);
    if (filters.comuna) params.append('comuna', filters.comuna);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`${SUPPLIERS_ENDPOINT}/search?${params}`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : [],
      message: response.data.message,
    };
  },
};

// Export individual functions for backward compatibility
export const getSuppliers = suppliersApi.getSuppliers;
export const getSupplier = suppliersApi.getSupplier;
export const updateBusiness = suppliersApi.updateBusiness;
export const getCurrentSupplier = suppliersApi.getCurrentSupplier;

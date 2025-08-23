import { AuthCustomer, AuthSupplier, AuthUser } from '../types/auth';
import api from './api';

export interface ApiClient {
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
}

// Simple wrapper around the existing API client
export const apiClient: ApiClient = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

// Auth-related API calls
export const authApi = {
  getCurrentUser: async (email: string): Promise<AuthUser> => {
    const response = await apiClient.get(`auth/user/${email}`);
    return response.data;
  },

  createCustomer: async (data: { email: string; nombre: string; telefono?: string }) => {
    const response = await apiClient.post('/auth/signup/customer', data);
    return response.data;
  },

  createSupplier: async (data: {
    email: string;
    nombre: string;
    nombre_negocio?: string;
    descripcion?: string;
    telefono_contacto?: string;
  }) => {
    const response = await apiClient.post('/auth/signup/supplier', data);
    return response.data;
  },

  getCustomerProfile: async (userId: number): Promise<AuthCustomer | null> => {
    try {
      const response = await apiClient.get(`/customers/by-user/${userId}`);
      return response.data;
    } catch (error) {
      // Customer profile doesn't exist
      return null;
    }
  },

  getSupplierProfile: async (userId: number): Promise<AuthSupplier | null> => {
    try {
      const response = await apiClient.get(`/suppliers/by-user/${userId}`);
      return response.data;
    } catch (error) {
      // Supplier profile doesn't exist
      return null;
    }
  },

  updateUser: async (userId: number, data: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },
};

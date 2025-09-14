import { objectToCamelCase, objectToSnakeCase } from '@/utils/caseMapping';
import api from './api';

export interface UpdateUserProfileRequest {
  nombre?: string;
  email?: string;
  profilePictureUrl?: string;
}

export interface User {
  idUsuario: number;
  nombre: string;
  email: string;
  profilePictureUrl?: string;
  activo: boolean;
  fechaRegistro: Date;
  createdAt: Date;
  updatedAt: Date;
  telefono?: string;
  comuna?: string;
  descripcion?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UsersListResponse {
  success: boolean;
  data: User[];
  message?: string;
}

const USERS_ENDPOINT = '/usuarios';

export const usersApi = {
  // Update user profile information
  updateProfile: async (
    userId: number,
    profileData: UpdateUserProfileRequest,
  ): Promise<UserResponse> => {
    const mappedData = objectToSnakeCase(profileData);
    const response = await api.put(`${USERS_ENDPOINT}/${userId}`, mappedData);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : null,
      message: response.data.message,
    };
  },

  // Get user by ID
  getUser: async (userId: number): Promise<UserResponse> => {
    const response = await api.get(`${USERS_ENDPOINT}/${userId}`);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Search clients
  searchClients: async (filters: {
    searchTerm?: string;
    region?: string;
    comuna?: string;
    page?: number;
    limit?: number;
  }): Promise<UsersListResponse> => {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append('q', filters.searchTerm);
    if (filters.region) params.append('region', filters.region);
    if (filters.comuna) params.append('comuna', filters.comuna);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`${USERS_ENDPOINT}/search?${params}`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : [],
      message: response.data.message,
    };
  },
};

// Export individual functions for backward compatibility
export const updateUserProfile = usersApi.updateProfile;
export const getUser = usersApi.getUser;

import { objectToCamelCase, objectToSnakeCase } from '@/utils/caseMapping';
import api from './api';

export interface UpdateUserProfileRequest {
  nombre?: string;
  email?: string;
  profilePictureUrl?: string;
}

export interface UserResponse {
  success: boolean;
  data?: any;
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
};

// Export individual functions for backward compatibility
export const updateUserProfile = usersApi.updateProfile;
export const getUser = usersApi.getUser;

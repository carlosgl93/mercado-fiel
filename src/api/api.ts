import { supabase } from '@/lib/supabase';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add interceptor to automatically include Supabase auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('✅ Auth token added to request:', config.url);
      } else {
        console.warn('❌ No auth token found for request:', config.url);
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Authentication failed:', error.response?.data);
      // Optionally redirect to login or refresh token here
    }
    return Promise.reject(error);
  },
);

export default api;

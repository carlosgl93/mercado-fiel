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

export default api;

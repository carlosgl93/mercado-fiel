import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_ENV === 'production'
      ? import.meta.env.VITE_PROD_API_URL
      : 'http://localhost:3000',
});

export default api;

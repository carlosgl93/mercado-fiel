import axios from 'axios';

const paykuApi = axios.create({
  baseURL: import.meta.env.VITE_PAYKU_TARGET_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_PAYKU_API_KEY}`,
  },
});

export default paykuApi;

import axios from 'axios';

export const sendEmailApi = axios.create({
  method: 'post',
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  data: {
    options: {
      from: 'Mercado Fiel <contacto@mercadofiel.cl>',
    },
  },
  baseURL: import.meta.env.VITE_EMAIL_API_URL,
});

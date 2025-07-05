import axios from 'axios';

export const sendVerificationEmailApi = axios.create({
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  baseURL: import.meta.env.VITE_VERIFICATION_EMAIL_API_URL,
});

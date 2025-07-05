import api from '../api';

export const verifyPrestador = async (token: string) => {
  if (token === '')
    return {
      status: 'error',
      message: 'Invalid or expired token.',
      user: null,
    };

  try {
    const result = await api.post('/prestadores/verify-email', { token });
    console.log('result from verify-email', result);
    if (result.status === 200) {
      return {
        status: 'success',
        message: 'Email verificado exitosamente.',
        prestador: result.data.prestador,
      };
    }
  } catch (error) {
    console.log('error while posting to verify-email', error);
    console.error(error);
    return {
      status: 'error',
      message: 'Token invalida o expirada.',
      prestador: null,
    };
  }
};

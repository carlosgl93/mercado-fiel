import api from '../api';

export const getMessages = async (userId: number, prestadorId: string, userToken: string) => {
  try {
    const res = await api.get('/chat', {
      params: {
        prestadorId,
        userId,
        token: userToken || '',
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return error.message;
    }
  }
};

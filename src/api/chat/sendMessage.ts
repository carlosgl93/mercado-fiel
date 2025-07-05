import api from '../api';

type SendMessageParameters = {
  userId: number;
  message: string;
  prestadorId: string;
  token: string;
  sentBy: string;
};

export const sendMessage = async (messageParameters: SendMessageParameters) => {
  try {
    const response = await api.post('/chat', messageParameters, {
      headers: {
        Authorization: `Bearer ${messageParameters.token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

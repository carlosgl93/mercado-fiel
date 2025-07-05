import api from '../api';

type BackChats = {
  created_at: string;
  email: string;
  firstname: string;
  id: number;
  message: string;
  prestador_id: number;
  sent_by: string;
  usuario_id: number;
  lastname: string;
};

const formatMessages = (messages: BackChats[]) => {
  return messages.map((message) => ({
    id: message.id,
    createdAt: message.created_at,
    sentBy: message.sent_by,
    userId: message.usuario_id,
    prestadorId: message.prestador_id,
    message: message.message,
    firstname: message.firstname,
    lastname: message.lastname,
  }));
};

export const getUsuarioInboxMessages = async (userId: string) => {
  try {
    const response = await api.get('/inbox/usuario', {
      params: {
        userId,
      },
    });
    return formatMessages(response.data);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

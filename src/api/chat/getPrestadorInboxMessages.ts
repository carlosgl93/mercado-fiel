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
};

const formatMessages = (messages: BackChats[]) => {
  return messages.map((message) => ({
    id: message.id.toString(),
    createdAt: message.created_at,
    sentBy: message.sent_by,
    userId: message.usuario_id,
    prestadorId: message.prestador_id,
    message: message.message,
    firstname: message.firstname,
  }));
};

export const getPrestadorInboxMessages = async (prestadorId: string) => {
  try {
    const response = await api.get('/inbox/prestador', {
      params: {
        prestadorId,
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

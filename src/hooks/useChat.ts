import { sendEmailApi } from '@/api';
import {
  Conversation,
  getMessages,
  sendFirstMessage,
  sendMessage,
  SendMessageArgs,
} from '@/api/firebase/chat';
import { chatState } from '@/store/chat/chatStore';
import { notificationState } from '@/store/snackbar';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const useChat = (userId: string, providerId: string) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useRecoilState(chatState);
  const [message, setMessage] = useState('');
  const setNotification = useSetRecoilState(notificationState);
  const navigate = useNavigate();
  const client = useQueryClient();

  const { mutate: handleSaveMessage, isLoading: savingMessageLoading } = useMutation(sendMessage, {
    onSuccess: async () => {
      await client.invalidateQueries(['messages', userId, providerId]);
      await client.invalidateQueries(['userMessages', userId]);
      setMessage('');
    },
    onError: (error, variables, context: Conversation | undefined) => {
      // context is the snapshot value returned from onMutate
      console.log({ error });
      console.log({ variables });
      console.log({ context });
      if (context) {
        client.setQueryData(['messages', userId, providerId], () => context);
        // setMessages(context);
      }
      setNotification({
        open: true,
        message: 'Error al enviar el mensaje',
        severity: 'error',
      });
    },
  });

  const { mutate: handleSendFirstMessage, isLoading: sendFirstMessageLoading } = useMutation(
    sendFirstMessage,
    {
      onSuccess: async (data) => {
        await client.invalidateQueries(['messages', userId, providerId]);
        console.log('data success sent', data);
        sendEmailApi.post('/', {
          sentBy: data?.sentBy,
          senderName: data?.sentBy === 'provider' ? data?.providerName : data?.username,
          recipientName: data?.sentBy === 'provider' ? data?.username : data?.providerName,
          templateName: 'new-message.html',
          options: {
            from: 'Mercado Fiel <contacto@mercadofiel.cl>',
            to: data?.sentBy === 'provider' ? data?.userEmail : data?.providerEmail,
            subject: 'Te han enviado un mensaje!',
            text: 'Te han enviado un mensaje!',
          },
        });
        const navigateTo = data?.sentBy === 'provider' ? '/prestador-chat' : '/chat';
        navigate(navigateTo, {
          state: {
            prestador: {
              id: providerId,
            },
          },
        });
        setNotification({
          open: true,
          message: 'Mensaje enviado',
          severity: 'success',
        });
      },
    },
  );

  const { data: fetchMessages, isLoading: messagesLoading } = useQuery(
    ['messages', userId, providerId],
    () => getMessages({ userId, providerId }),
    {
      retry: true,
      enabled: !!userId && !!providerId,
      onError(err) {
        console.log('error getting messages', err);
      },
      onSuccess(data) {
        if (data) {
          setMessages(data);
        }
      },
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  );

  const sendWithEnter = (e: React.KeyboardEvent, args: SendMessageArgs) => {
    if (e.code === 'Enter') {
      handleSaveMessage({
        ...args,
        providerId: messages?.providerId,
        providerName: messages?.providerName,
      });
    } else {
      return;
    }
  };

  const scrollToElement = () => {
    const { current } = lastMessageRef;
    if (current !== null) {
      current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToElement();
  }, [messages, fetchMessages]);

  return {
    fetchMessages,
    message,
    messages,
    savingMessageLoading,
    sendFirstMessageLoading,
    messagesLoading,
    lastMessageRef,
    setMessage,
    handleSendFirstMessage,
    sendWithEnter,
    handleSaveMessage,
  };
};

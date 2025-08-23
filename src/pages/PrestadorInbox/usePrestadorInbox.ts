import { Conversation, getProviderInboxMessages } from '@/api/firebase/chat';
import { chatState } from '@/store/chat/chatStore';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';

export const usePrestadorInbox = () => {
  const { supplier } = useAuth();
  const setMessages = useSetRecoilState(chatState);
  const providerId = supplier?.idProveedor;

  const router = useNavigate();

  const handleClickChat = (chat: Conversation) => {
    setMessages(chat);
    router('/prestador-chat');
  };

  const { data: fetchProvidersChat, isLoading: isLoadingProvidersChats } = useQuery(
    ['providerMessages', providerId],
    () => getProviderInboxMessages({ providerId: String(providerId ?? '') }),
  );

  return {
    handleClickChat,
    fetchProvidersChat,
    isLoadingProvidersChats,
  };
};

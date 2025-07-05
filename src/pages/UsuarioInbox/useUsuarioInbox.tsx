import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Conversation, getUserInboxMessages } from '@/api/firebase/chat';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '@/store/auth/user';
import { chatState } from '@/store/chat/chatStore';

export const useUsuarioInbox = () => {
  const user = useRecoilValue(userState);
  const setMessages = useSetRecoilState(chatState);

  const userId = user?.id;

  const router = useNavigate();

  const handleClickChat = (chat: Conversation) => {
    setMessages(chat);
    router('/chat');
  };

  const { data: fetchUserChat, isLoading: isLoadingUserChats } = useQuery(
    ['userMessages', userId],
    () => getUserInboxMessages({ userId: userId ?? '' }),
  );

  return {
    isLoadingUserChats,
    fetchUserChat,
    handleClickChat,
  };
};

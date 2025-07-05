import { Apoyo } from '@/api/supportRequests';
import { useAuthNew, useChat, useComunas, useCustomer } from '@/hooks';
import { User } from '@/store/auth/user';
import { getRecurrencyText } from '@/utils/getRecurrencyText';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const VerApoyoController = (apoyoProps?: Apoyo) => {
  const [openContactCustomer, setOpenContactCustomer] = useState(false);
  const location = useLocation();
  const { prestador, user } = useAuthNew();
  const { allComunas } = useComunas();
  const apoyo = (location.state.apoyo as Apoyo) || apoyoProps;
  const {
    customer = {} as User,
    isLoading,
    error,
  } = useCustomer((location.state?.cliente?.id || apoyo?.userId) ?? '');
  const navigate = useNavigate();
  const disableContact = user?.id === customer.id;

  const { email, service, firstname, speciality, profileImageUrl } = customer;
  const { message, setMessage, messages, messagesLoading, savingMessageLoading } = useChat(
    customer.id ?? apoyo.userId ?? '',
    prestador?.id ?? '',
  );

  const translatedRecurrency = getRecurrencyText(
    apoyo?.recurrency,
    Number(apoyo?.sessionsPerRecurrency),
  );

  const handleContact = () => {
    const whoIs = (prestador?.id || '').length > 5 ? 'provider' : 'user';
    console.log('who is ', whoIs);
    console.log('messages', messages);
    if ((messages?.messages ?? []).length > 0) {
      navigate(whoIs === 'provider' ? '/prestador-chat' : '/chat', {
        state: {
          customer,
          prestador,
          messages,
          sentBy: whoIs,
        },
      });
      return;
    }
    setOpenContactCustomer(true);
    return;
  };

  return {
    customer,
    prestador,
    allComunas,
    translatedRecurrency,
    profileImageUrl,
    speciality,
    firstname,
    service,
    email,
    message,
    setMessage,
    messages,
    messagesLoading,
    savingMessageLoading,
    handleContact,
    openContactCustomer,
    setOpenContactCustomer,
    isLoading,
    error,
    apoyo,
    disableContact,
  };
};

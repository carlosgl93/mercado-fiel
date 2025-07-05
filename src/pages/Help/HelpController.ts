import { sendSupportMessage } from '@/api/help';
import { notificationState } from '@/store/snackbar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const HelpController = () => {
  const setNotification = useSetRecoilState(notificationState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { mutate: sendSupportMessageMutation, isLoading: sendSupportMessageIsLoading } =
    useMutation('sendSupportMessage', sendSupportMessage, {
      onSuccess() {
        setNotification({
          open: true,
          message: 'Mensaje enviado, te responderemos a la brevedad',
          severity: 'success',
        });
      },
      onError() {
        setNotification({
          open: true,
          message: 'Hubo un error, intentalo nuevamente',
          severity: 'error',
        });
      },
    });
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return {
    name,
    message,
    email,
    sendSupportMessageIsLoading,
    sendSupportMessageMutation,
    handleNameChange,
    handleEmailChange,
    handleMessageChange,
  };
};

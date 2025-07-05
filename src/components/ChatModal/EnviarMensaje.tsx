import React from 'react';
import { Title } from '../StyledComponents';
import {
  StyledTextArea,
  StyledMessageOption,
  StyledModalCTAsContainer,
  StyledCerrarButton,
  StyledEnviarButton,
} from './ChatModalStyledComponents';
import { useChat } from '@/hooks';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthNew } from '@/hooks/useAuthNew';
import Loading from '../Loading';
import { Box } from '@mui/material';
import { interactedPrestadorState } from '@/store/resultados/interactedPrestador';
import { useRecoilValue } from 'recoil';
import { Apoyo } from '@/api/supportRequests';
import { User } from '@/store/auth/user';
import { Prestador } from '@/store/auth/prestador';
import { SendMessageArgs } from '@/api/firebase/chat';

type EnviarMensajeProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleClose: () => void;
  messagesOptions?: Array<string>;
  prestadorId?: string;
  userId?: string;
  sentBy?: 'user' | 'provider';
  apoyo?: Apoyo;
  customer?: User;
  prestador?: Prestador;
};

const commonMessages = [
  'Hola, me gustaría saber si estás disponible esta semana.',
  '¿Haces algun descuento por numero de horas?',
  '¿Me puedes contar mas sobre tu experiencia?',
];

export const EnviarMensaje = ({
  message,
  setMessage,
  handleClose,
  messagesOptions = commonMessages,
  prestadorId,
  userId,
  sentBy = 'user',
  customer,
  prestador,
}: EnviarMensajeProps) => {
  const handleClickPredefinedMessage = (message: string) => {
    setMessage(message);
  };
  const prestadorState = useRecoilValue(interactedPrestadorState);
  const interactedPrestador = prestadorState
    ? prestadorState
    : { id: '', firstname: '', email: '' };
  const { pathname } = useLocation();
  const { id } = useParams();
  const { user } = useAuthNew();
  const providerId =
    prestador?.id ?? prestadorId ?? interactedPrestador?.id ?? (id || prestador?.id);
  const customerId = userId ?? user?.id ?? customer?.id;

  let firstMessage: SendMessageArgs;
  if (pathname.includes('/perfil-prestador')) {
    firstMessage = {
      message,
      sentBy,
      providerId: providerId,
      userId: customerId,
      username: user?.firstname,
      providerName: interactedPrestador?.firstname?.length
        ? interactedPrestador.firstname
        : interactedPrestador.email,
      providerEmail: interactedPrestador.email,
      userEmail: user?.email ?? '',
    };
  } else {
    firstMessage = {
      message,
      sentBy,
      providerId: providerId,
      userId: customerId,
      username: customer?.firstname,
      providerName: prestador?.firstname?.length ? prestador?.firstname : prestador?.email,
      providerEmail: prestador!.email,
      userEmail: customer!.email,
    };
  }

  const { handleSendFirstMessage, sendFirstMessageLoading } = useChat(
    customerId ?? '',
    providerId ?? '',
  );

  return (
    <Box
      sx={{
        width: {
          xs: '90vw',
          sm: '80vw',
          md: '50vw',
        },
      }}
    >
      {sendFirstMessageLoading ? (
        <Loading />
      ) : (
        <>
          <Title sx={{ fontSize: '2rem', textAlign: 'center', mb: '1rem' }}>Enviar mensaje</Title>
          <StyledTextArea
            minRows={3}
            cols={45}
            placeholder="Escribe tu mensaje aqui o elige una de estas opciones:"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {messagesOptions.map((m, index) => (
            <StyledMessageOption
              variant="outlined"
              key={index}
              id={m}
              onClick={() => handleClickPredefinedMessage(m)}
            >
              {m}
            </StyledMessageOption>
          ))}
          <StyledModalCTAsContainer>
            <StyledCerrarButton variant="contained" onClick={handleClose}>
              Cerrar
            </StyledCerrarButton>
            <StyledEnviarButton
              variant="contained"
              color="primary"
              onClick={() => handleSendFirstMessage(firstMessage)}
              disabled={message.length < 5}
            >
              Enviar
            </StyledEnviarButton>
          </StyledModalCTAsContainer>
        </>
      )}
    </Box>
  );
};

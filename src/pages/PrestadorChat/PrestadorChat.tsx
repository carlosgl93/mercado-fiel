import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Mensaje } from '@/types/Mensaje';
import {
  ChatContainer,
  StyledChatInput,
  StyledChatInputContainer,
  StyledChatSendButton,
  StyledCustomerName,
  StyledMensajeAndtTimestampContainer,
  StyledMensajeTimestamp,
  StyledPrestadorMensajeContainer,
  StyledPrestadorMensajeText,
  StyledProviderName,
  StyledTimestampContainer,
  StyledUsuarioMensajeContainer,
  StyledUsuarioMensajeText,
} from './StyledPrestadorChatMensajes';

import { Prestador } from '@/types/Prestador';

import Loading from '@/components/Loading';
import { formatDate } from '@/utils/formatDate';
import { Box, CircularProgress } from '@mui/material';
import { chatState } from '@/store/chat/chatStore';
import { useRecoilValue } from 'recoil';
import { useAuthNew, useChat, useUser } from '@/hooks';
import { CenteredFlexBox } from '@/components/styled';

export type LocationState = {
  messages: Mensaje[];
  prestador: Prestador;
  sentBy: string;
};

export const PrestadorChat = () => {
  const { prestador } = useAuthNew();

  const conversation = useRecoilValue(chatState);
  const customerId = conversation?.userId;
  const prestadorId = conversation?.providerId;
  const { user } = useUser(customerId);

  const {
    messages,
    savingMessageLoading,
    lastMessageRef,
    messagesLoading,
    message,
    sendWithEnter,
    handleSaveMessage,
    setMessage,
  } = useChat(customerId, prestadorId);

  return (
    <ChatContainer>
      {messagesLoading && <Loading />}
      {messages?.messages?.map((m, index: number) => {
        const isLastMessage = index === conversation?.messages?.length - 1;
        if (m?.sentBy === 'provider') {
          return (
            <Box key={m.id}>
              <StyledPrestadorMensajeContainer ref={isLastMessage ? lastMessageRef : null}>
                {conversation?.messages[index - 1]?.sentBy === 'provider' ? null : (
                  <StyledProviderName>
                    {conversation?.providerName.includes('@') ? 'Tú' : conversation?.providerName}:
                  </StyledProviderName>
                )}

                <StyledMensajeAndtTimestampContainer>
                  <StyledPrestadorMensajeText>{m.message}</StyledPrestadorMensajeText>
                  <StyledTimestampContainer>
                    <StyledMensajeTimestamp>{formatDate(m.timestamp)}</StyledMensajeTimestamp>
                  </StyledTimestampContainer>
                </StyledMensajeAndtTimestampContainer>
              </StyledPrestadorMensajeContainer>
            </Box>
          );
        } else {
          return (
            <Box key={m.id}>
              <StyledUsuarioMensajeContainer ref={isLastMessage ? lastMessageRef : null}>
                {conversation?.messages[index - 1]?.sentBy === 'user' ? null : (
                  <StyledCustomerName>{conversation?.username}:</StyledCustomerName>
                )}

                <StyledMensajeAndtTimestampContainer>
                  <StyledUsuarioMensajeText>{m.message}</StyledUsuarioMensajeText>
                  <StyledTimestampContainer>
                    <StyledMensajeTimestamp>{formatDate(m.timestamp)}</StyledMensajeTimestamp>
                  </StyledTimestampContainer>
                </StyledMensajeAndtTimestampContainer>
              </StyledUsuarioMensajeContainer>
            </Box>
          );
        }
      })}
      <StyledChatInputContainer>
        {savingMessageLoading ? (
          <CenteredFlexBox
            sx={{
              width: '100vw',
              justifyContent: 'center',
            }}
          >
            <CircularProgress sx={{ margin: '0 auto' }} />
          </CenteredFlexBox>
        ) : (
          <>
            <StyledChatInput
              value={message}
              placeholder="Escribe tu mensaje"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                sendWithEnter(e, {
                  message,
                  sentBy: 'provider',
                  providerId: prestador?.id ?? '',
                  userId: user?.id ?? '',
                  username: user?.firstname ? user.firstname : user?.email ? user.email : '',
                  providerName: prestador?.firstname,
                  providerEmail: prestador?.email || '',
                  userEmail: user?.email || '',
                })
              }
            />
            <StyledChatSendButton
              onClick={() =>
                handleSaveMessage({
                  message,
                  sentBy: 'provider',
                  providerId: conversation?.providerId,
                  userId: conversation?.userId,
                  username: conversation?.username,
                  providerName: conversation?.providerName,
                  providerEmail: prestador?.email || '',
                  userEmail: user?.email || '',
                })
              }
              disabled={message.length === 0}
            >
              <SendOutlinedIcon />
            </StyledChatSendButton>
          </>
        )}
      </StyledChatInputContainer>
    </ChatContainer>
  );
};

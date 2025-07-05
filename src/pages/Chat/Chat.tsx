import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  ChatContainer,
  StyledChatInput,
  StyledChatInputContainer,
  StyledChatSendButton,
  StyledMensajeTimestamp,
  StyledPrestadorMensajeContainer,
  StyledPrestadorMensajeText,
  StyledPrestadorName,
  StyledTimestampContainer,
  StyledUsuarioMensajeContainer,
  StyledUsuarioMensajeText,
} from './StyledChatMensajes';

import Loading from '@/components/Loading';
import { formatDate } from '@/utils/formatDate';
import { Box, CircularProgress } from '@mui/material';
import { useAuthNew } from '@/hooks/useAuthNew';
import { useRecoilValue } from 'recoil';
import { chatState } from '@/store/chat/chatStore';
import { useChat, usePrestador } from '@/hooks';
import { CenteredFlexBox } from '@/components/styled';
import { useLocation } from 'react-router-dom';

export const UserChat = () => {
  const { user } = useAuthNew();
  const conversation = useRecoilValue(chatState);
  const { prestador } = usePrestador(conversation?.providerId);
  const location = useLocation();

  const userIdFromLocation = location?.state?.userId;
  const providerIdFromLocation = location?.state?.providerId;

  const {
    message,
    fetchMessages,
    messagesLoading,
    lastMessageRef,
    savingMessageLoading,
    setMessage,
    handleSaveMessage,
    sendWithEnter,
  } = useChat(
    userIdFromLocation ? userIdFromLocation : user?.id ?? '',
    providerIdFromLocation ? providerIdFromLocation : prestador?.id ?? '',
  );

  if (messagesLoading) {
    return (
      <ChatContainer>
        <Loading />
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      {messagesLoading ? (
        <Loading />
      ) : (
        fetchMessages?.messages.map((m, index: number) => {
          const isLastMessage = index === conversation.messages.length - 1;
          if (m?.sentBy === 'provider') {
            return (
              <StyledPrestadorMensajeContainer
                key={m.id + m.timestamp}
                ref={isLastMessage ? lastMessageRef : null}
              >
                {conversation.messages[index - 1]?.sentBy === 'provider' ? null : (
                  <StyledPrestadorName>
                    {conversation.providerName.includes('@') ? 'Tú' : conversation.providerName}:
                  </StyledPrestadorName>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <StyledPrestadorMensajeText>{m.message}</StyledPrestadorMensajeText>
                  <StyledTimestampContainer>
                    <StyledMensajeTimestamp>{formatDate(m.timestamp)}</StyledMensajeTimestamp>
                  </StyledTimestampContainer>
                </Box>
              </StyledPrestadorMensajeContainer>
            );
          } else {
            return (
              <StyledUsuarioMensajeContainer
                key={m.id + m.timestamp}
                ref={isLastMessage ? lastMessageRef : null}
              >
                <StyledUsuarioMensajeText>{m.message}</StyledUsuarioMensajeText>
                <StyledTimestampContainer>
                  <StyledMensajeTimestamp>{formatDate(m.timestamp)}</StyledMensajeTimestamp>
                </StyledTimestampContainer>
              </StyledUsuarioMensajeContainer>
            );
          }
        })
      )}

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
                  sentBy: 'user',
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
                  sentBy: 'user',
                  providerId: conversation.providerId,
                  userId: conversation.userId,
                  username: conversation.username,
                  providerName: conversation.providerName,
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

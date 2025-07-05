import { Box, List, ListItem, styled } from '@mui/material';
import { useUsuarioInbox } from './useUsuarioInbox';
import { Text } from '@/components/StyledComponents';
import { StyledAvatar } from '../PerfilPrestador/MobilePerfilPrestadorStyledComponents';
import { StyledTitle, Wrapper } from '../PrestadorDashboard/StyledPrestadorDashboardComponents';
import { formatDate } from '@/utils/formatDate';
import Loading from '@/components/Loading';

const TitleContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  borderRadius: '0.5rem',
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const ChatAvatar = styled(StyledAvatar)(() => ({
  width: '64px',
  height: '64px',
  marginRight: '1rem',
  marginTop: 0,
  marginBottom: 0,
}));

const StyledChatDate = styled(Text)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const UsuarioInbox = () => {
  const { fetchUserChat, isLoadingUserChats, handleClickChat } = useUsuarioInbox();

  return (
    <Wrapper
      sx={{
        justifyContent: 'start',
      }}
    >
      <TitleContainer>
        <StyledTitle>Inbox</StyledTitle>
      </TitleContainer>
      {isLoadingUserChats && <Loading />}
      {fetchUserChat && fetchUserChat.length === 0 && <p>No hay mensajes</p>}
      {fetchUserChat && fetchUserChat.length > 0 && (
        <StyledList>
          {fetchUserChat?.map((chat) => {
            const { id, providerName, messages } = chat;

            const lastMessageTimestamp = messages[messages.length - 1].timestamp;

            return (
              <StyledListItem key={id} onClick={() => handleClickChat(chat)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChatAvatar />
                  <Text>{providerName}</Text>
                </Box>
                <Box>
                  <StyledChatDate>{formatDate(lastMessageTimestamp)}</StyledChatDate>
                </Box>
              </StyledListItem>
            );
          })}
        </StyledList>
      )}
    </Wrapper>
  );
};

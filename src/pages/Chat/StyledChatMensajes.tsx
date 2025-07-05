import { Text } from '@/components/StyledComponents';
import { Box, IconButton, TextField, Typography, styled } from '@mui/material';

export const ChatContainer = styled(Box)(() => ({
  minHeight: '70vh',
  paddingTop: '1.75rem',
  paddingBottom: '3.75rem',
  marginBottom: '3.75rem',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const ChatTitleContainer = styled(Box)(() => ({}));

export const ChatTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 'bolder',
  color: theme.palette.primary.main,
  width: '80%',
}));

export const StyledPrestadorMensajeContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '0.5rem',
  maxWidth: '80vw',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
  backgroundColor: 'white',
  width: 'fit-content',
}));

export const StyledPrestadorName = styled(Text)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

export const StyledPrestadorMensajeText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

export const StyledUsuarioMensajeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  left: '40vw',
  gap: '1rem',
  margin: '0.25rem, 1vw',
  marginBottom: '0.5rem',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.palette.primary.main,
  maxWidth: '60vw',
}));

export const StyledUsuarioMensajeText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: theme.palette.primary.contrastText,
}));

export const StyledTimestampContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '2rem',
}));

export const StyledMensajeTimestamp = styled('span')(() => ({
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'grey',
  textAlign: 'end',
}));

export const StyledChatInputContainer = styled(Box)(() => ({
  position: 'fixed',
  bottom: '0',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  marginTop: '1rem',
  padding: '0.3rem 0.3rem',
  backgroundColor: 'white',
  width: '100%',
}));

export const StyledChatInput = styled(TextField)(() => ({
  width: '100%',
}));

export const StyledChatSendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '0.5rem 1rem',
  borderRadius: '1rem',
}));

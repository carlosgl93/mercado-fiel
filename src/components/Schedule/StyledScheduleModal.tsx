import { Box, Button, FormGroup, InputLabel, Modal, TextareaAutosize, styled } from '@mui/material';
import { DigitalClock } from '@mui/x-date-pickers';

export const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  my: '5rem',
  '&::-webkit-scrollbar': {
    display: 'none', // Hide scrollbars for Chrome, Safari, and newer Edge versions
  },
  '&': {
    scrollbarWidth: 'none', // Hide scrollbars for Firefox
    msOverflowStyle: 'none', // Hide scrollbars for IE 10+
  },
}));

export const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '0.5rem',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

export const StyledTextArea = styled(TextareaAutosize)(() => ({
  width: '100%',
  border: '1px solid #000',
  borderRadius: '0.5rem',
  padding: '1rem',
  marginBottom: '1rem',
}));

export const StyledMessageOption = styled(Button)(() => ({
  border: '1px solid #000',
  borderRadius: '0.5rem',
  padding: '1rem',
  marginBottom: '1rem',
}));

export const StyledModalCTAsContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '1rem',
}));

export const StyledEnviarButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '2rem',
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  cursor: 'pointer',
}));

export const StyledCerrarButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  borderRadius: '2rem',
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  cursor: 'pointer',
}));

export const StyledMessage = styled(Box)(() => ({
  border: '1px solid #000',
  borderRadius: '0.5rem',
  padding: '1rem',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
}));

export const StyledMessageText = styled(Box)(() => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

export const StyledMessageDate = styled(Box)(() => ({
  fontSize: '1rem',
}));

export const StyledMessageSender = styled(Box)(() => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

export const StyledMessageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));

export const StyledChatContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
}));

export const StyledScheduleContainer = styled(Box)(() => ({
  height: '100%',
}));

export const StyledScheduleForm = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  padding: '1rem 0',
  justifyContent: 'center',
  textAlign: 'center',
}));

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textWrap: 'pretty',
}));

export const StyledDateTimePicker = styled(DigitalClock)(() => ({
  width: 'fit-content',
}));

export const StyledTitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

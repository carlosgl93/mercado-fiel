import { TextContainer, Title } from '@/components/StyledComponents';
import { Box, List, ListItemButton, styled } from '@mui/material';

export const StyledTextContainer = styled(TextContainer)(() => ({
  textAlign: 'center',
}));

export const StyledTitle = styled(Title)(() => ({
  fontSize: '2rem',
  marginTop: '2.5vh',
}));

export const StyledSubtitle = styled(Title)(() => ({
  fontSize: '1.2rem',
  marginTop: '2.5vh',
}));

export const StyledList = styled(List)(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  maxWidth: '600px',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
}));

export const StyledListItemButton = styled(ListItemButton)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '0.5rem',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  maxWidth: 'fit-content',
}));

export const ContentContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  my: '1vh',
}));

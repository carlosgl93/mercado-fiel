import { FlexBox } from '@/components/styled';
import { Title } from '@/components/StyledComponents';
import { Box, Button, styled } from '@mui/material';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  padding: '1rem',
  minHeight: '80vh',
  margin: 'auto',
}));

export const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: '1rem',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  borderRadius: '.5rem',
  width: '100%',
  height: '100%',
}));

export const StyledTitle = styled(Title)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: theme.palette.primary.main,
  textAlign: 'start',
}));

export const SubTitle = styled(Title)(() => ({
  fontSize: '1.175rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#414042',
}));

export const StyledList = styled('ul')(() => ({
  paddingRight: '1rem',
}));

export const StyledButton = styled(Button)(() => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  margin: '1rem 0',
}));

export const BackButtonContainer = styled(FlexBox)(() => ({
  width: '100%',
  justifyContent: 'flex-start',
  maxWidth: '568px',
}));

export const SectionTitleContainer = styled(FlexBox)(() => ({
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  maxWidth: '568px',
}));

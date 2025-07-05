import { Title } from '@/components/StyledComponents';
import { Avatar, Box, Typography, styled } from '@mui/material';

export const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
}));

export const HeroContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.primary.dark,
}));

export const StyledAvatar = styled(Avatar)(() => ({
  width: '8rem',
  height: '8rem',
  margin: '3rem auto',
}));

export const StyledNameContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '2rem',
  fontWeight: 500,
  textAlign: 'center',
  my: '1rem',
}));

export const StyledTitle = styled(Title)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  lineHeight: '1.5rem',
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
}));

export const ReviewsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '1rem',
  marginTop: '1rem',
}));

export const StyledServicio = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 400,
  textAlign: 'center',
  margin: '1rem 0',
}));

export const StyledCTAs = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '1rem',
  marginBottom: '2rem',
}));

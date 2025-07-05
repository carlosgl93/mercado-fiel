import { Avatar, Box, Button, Typography, styled } from '@mui/material';

export const StyledHeroBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  height: '45vh',
}));

export const StyledBackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '33px',
  padding: '0.5rem 1rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
  },
}));

export const StyledHeroContent = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: ' 0 20%',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '10rem',
  height: '10rem',
  margin: '0 auto',
  border: `1px solid ${theme.palette.primary.main}`,
}));

export const StyledName = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: '2rem',
  fontWeight: 500,
  textAlign: 'center',
  marginTop: '1rem',
}));

export const StyledServicio = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 400,
  textAlign: 'center',
  marginTop: '1rem',
}));

export const StyledCTAs = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '1rem',
  gap: '1rem',
}));

export const StyledContactButton = styled(Button)(({ theme }) => ({
  color: theme.palette.background.paper,
  backgroundColor: theme.palette.secondary.contrastText,
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledShortListButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
  },
}));

export const StyledAbout = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'lightgray',
  padding: '1rem',
}));

export const ProfileGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '0.75fr 1fr',
  gap: '1rem',
  margin: '1rem 10%',
  backgroundColor: 'white',
  padding: '1rem',
}));

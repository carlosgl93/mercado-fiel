import { Box, Button, Container, Typography, styled } from '@mui/material';

export const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
  backgroundColor: '#f9f7f6',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const TextContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(4),
  },
}));

export const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: '1.1rem',
  fontWeight: 400,
  textAlign: 'justify',
  textRendering: 'optimizeLegibility',
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '3rem',
  color: theme.palette.primary.dark,
}));

export const SubTitle = styled(Title)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  margin: '1rem',
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  paddingBottom: '3rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  flexWrap: 'wrap',
  '& > *': {
    flex: '1 1 50%', // Minimum 2 avatars per row on xs and sm screens
    [theme.breakpoints.up('sm')]: {
      flex: '1 1 33%', // 3 avatars per row on md screens
    },
    [theme.breakpoints.up('md')]: {
      flex: '1 1 25%', // 3 avatars per row on md screens
    },
    [theme.breakpoints.up('lg')]: {
      flex: '1 1 17.5%', // 4 avatars per row on lg screens
    },
  },
}));

export const PersonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const StyledSelect = styled('select')(({ theme }) => ({
  width: '100%',
  border: '1px solid',
  padding: '0.8rem',
  borderRadius: '2rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  fontFamily: 'inherit',
  fontSize: '0.8rem',
  margin: '2.5vh 0',
  justifyContent: 'space-around',
}));

export const StyledUnorderedList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const StyledListItem = styled('li')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: '1rem',
  backgroundColor: theme.palette.background.paper,
  justifyContent: 'flex-start',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
}));

export const StyledRadioInput = styled('input')(({ theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

export const StyledCheckboxInput = styled('input')(({ theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '0.25rem',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

export const StyledBackButton = styled(Button)(() => ({}));

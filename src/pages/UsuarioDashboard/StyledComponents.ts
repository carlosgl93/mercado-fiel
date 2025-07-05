import { Box, Button, styled } from '@mui/material';
import { Title } from '@/components/StyledComponents';

export const DashboardTileContainer = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  borderRadius: '.5rem',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
}));

export const StyledTitle = styled(Title)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: theme.palette.primary.main,
  textAlign: 'start',
}));

export const SubTitle = styled(Title)(() => ({
  fontSize: '1.375rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: 'black',
}));

export const ButtonCTA = styled(Button)(() => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  margin: '1rem 0.5rem',
}));

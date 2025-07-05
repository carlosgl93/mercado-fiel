import { Text } from '@/components/StyledComponents';
import { CheckCircleOutlineOutlined, CircleOutlined } from '@mui/icons-material';
import { Box, ListItem, styled } from '@mui/material';
import { Link } from 'react-router-dom';

export const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  padding: '1rem',
  marginBottom: '1rem',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  borderRadius: '.5rem',
}));

export const StyledListItem = styled(ListItem)(() => ({
  listStyleType: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  padding: '0.5rem 0.5rem 0.5rem 0',
}));

export const StyledUncheckedIcon = styled(CircleOutlined)(({ theme }) => ({
  color: theme.palette.primary.main,
}));
export const StyledCheckedIcon = styled(CheckCircleOutlineOutlined)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '50%',
}));

export const StyledOption = styled(Text)(({ theme }) => ({
  marginLeft: '1rem',
  color: theme.palette.secondary.dark,
}));

export const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
}));

export const StyledText = styled(Text)(() => ({
  fontSize: '0.9rem',
}));

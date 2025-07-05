import { Box, OutlinedInput, styled } from '@mui/material';

export const StyledComunaSearchBar = styled(OutlinedInput)(() => ({
  backgroundColor: 'white',
  borderRadius: '2rem',
  my: 3,
}));

export const SearchBarIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '3rem',
  height: '2.5rem',
  width: '2.5rem',
  padding: '0.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledResults = styled(Box)(() => ({
  backgroundColor: 'white',
  borderRadius: '5px',
  maxHeight: '10rem',
  overflow: 'auto',
}));

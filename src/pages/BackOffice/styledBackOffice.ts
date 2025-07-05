import { Box, Container, OutlinedInput, styled } from '@mui/material';

export const Wrapper = styled(Container)(() => ({
  minHeight: '75vh',
  padding: '1rem',
}));

export const IconButtonBox = styled(Box)(() => ({
  backgroundColor: 'primary.main',
  borderRadius: '3rem',
  height: '2.5rem',
  width: '2.5rem',
  padding: '0.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  width: 'auto',
  backgroundColor: 'white',
  borderRadius: '2rem',
  marginBottom: '1rem',
}));

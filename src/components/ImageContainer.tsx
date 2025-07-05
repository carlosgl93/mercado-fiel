import { Box, styled } from '@mui/material';

export const StyledImageContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

export const Image = styled('img')({
  height: '100%',
  width: 'auto',
  objectFit: 'cover',
});

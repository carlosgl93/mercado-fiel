import { Box, Divider, styled } from '@mui/material';

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: '1% 0',
  borderColor: theme.palette.background.default,
  borderWidth: '1px',
  width: '90%',
}));

export const CenteredDivider = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        margin: '0',
        // height: '3px'
      }}
    >
      <StyledDivider />
    </Box>
  );
};

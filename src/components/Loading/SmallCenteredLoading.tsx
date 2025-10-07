import CircularProgress from '@mui/material/CircularProgress';

import { FlexBox } from '@/components/styled';

export function SmallCenteredLoading() {
  return (
    <FlexBox sx={{
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}>
      <CircularProgress size={16} />
    </FlexBox>
  );
}


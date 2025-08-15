import Box from '@mui/material/Box';
import { styled } from '@mui/system';

const FlexBox = styled(Box)({
  display: 'flex',
});

const CenteredFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'center',
});

const FlexColumn = styled(FlexBox)({
  flexDirection: 'column',
});

const ColumnCenteredFlexBox = styled(CenteredFlexBox)({
  flexDirection: 'column',
});

const FullSizeCenteredFlexBox = styled(CenteredFlexBox)({
  width: '100%',
  minHeight: '80vh',
});

// make a styled image component that accepts src and alt props
const HeaderIconImage = styled('img')({
  width: 'auto',
  height: '60px',
  margin: 4,
  borderRadius: '8px',
});

export {
  CenteredFlexBox,
  ColumnCenteredFlexBox,
  FlexBox,
  FlexColumn,
  FullSizeCenteredFlexBox,
  HeaderIconImage,
};

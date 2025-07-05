import { Box, styled } from '@mui/material';
import { StyledDayName } from './ListAvailableDays';

export const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '1rem 0',
}));

export const StyledDayContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80vw',
}));

export const StyledEditableDay = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'start',
}));

export const StyledToggleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const StyledTimePickerContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '1rem 0.5rem',
  width: '100%',
}));

export const StyledTimerContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledSelect = styled('select')(() => ({
  width: '100%',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  border: '1px solid black',
  margin: '0.5rem 0rem',
}));

export const StyledTimeTitle = styled(StyledDayName)(() => ({
  marginLeft: '0',
}));

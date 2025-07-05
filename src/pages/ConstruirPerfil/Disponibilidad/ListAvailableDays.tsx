import { SubTitle } from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import { Box, List, ListItem, styled } from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Text } from '@/components/StyledComponents';

const StyledListItem = styled(ListItem)(() => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '10% 30% 60%',
  '& > :nth-last-of-type()': {
    justifyContent: 'end',
  },
  columnGap: '1rem',
}));

const StyledTimeText = styled(Text)(() => ({
  fontSize: '0.8rem',
}));

export const StyledDayName = styled(SubTitle)(() => ({
  marginBottom: 0,
  fontSize: '1rem',
  marginLeft: '0.66rem',
}));

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilityData {
  id: number;
  day: string;
  times: TimeSlot;
  isAvailable: boolean;
}

type ListAvailableDaysProps = {
  availability: AvailabilityData[] | undefined;
};

export const ListAvailableDays = ({ availability }: ListAvailableDaysProps) => {
  if (!availability) return null;

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'start',
      }}
    >
      {availability.map((d) => {
        const { day, times, isAvailable } = d;
        return (
          <StyledListItem key={day}>
            {isAvailable ? <StyledDoneIcon /> : <StyledCloseIcon />}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: { xs: '60vw', sm: '60vw', md: '500px' },
              }}
            >
              <StyledDayName
                sx={{
                  textTransform: 'capitalize',
                }}
              >
                {day}
              </StyledDayName>
              {!isAvailable ? (
                <StyledTimeText>No disponible</StyledTimeText>
              ) : times.startTime === '00:00' && times.endTime === '23:59' ? (
                <StyledTimeText>Todo el dia</StyledTimeText>
              ) : (
                <StyledTimeText sx={{}}>
                  De {times.startTime} a {times.endTime}
                </StyledTimeText>
              )}
            </Box>
          </StyledListItem>
        );
      })}
    </List>
  );
};

const StyledDoneIcon = styled(DoneOutlinedIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledCloseIcon = styled(CloseOutlinedIcon)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));

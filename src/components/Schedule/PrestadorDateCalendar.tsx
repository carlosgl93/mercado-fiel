import { Box } from '@mui/material';
import { DateCalendar, PickersDayProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { StyledLabel } from './StyledScheduleModal';
import { TScheduleState } from '@/store/schedule/sheduleState';
import { SetterOrUpdater } from 'recoil';

type PrestadorDateCalendarProps = {
  shouldDisableDay: (date: dayjs.Dayjs) => boolean;
  renderAvailableDay: (props: PickersDayProps<dayjs.Dayjs>) => JSX.Element;
  handleSelectDate: (e: dayjs.Dayjs) => void;
  schedule: TScheduleState;
  availableTimesStep: number | undefined;
  setSchedule: SetterOrUpdater<TScheduleState>;
  setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  shouldDisableTime: (time: dayjs.Dayjs) => boolean;
};

export const PrestadorDateCalendar = ({
  shouldDisableDay,
  renderAvailableDay,
  handleSelectDate,
}: PrestadorDateCalendarProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <StyledLabel>Fecha</StyledLabel>
      <DateCalendar
        shouldDisableDate={shouldDisableDay}
        disablePast
        slots={{ day: renderAvailableDay }}
        onChange={handleSelectDate}
      />
    </Box>
  );
};

import { Box } from '@mui/system';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { StyledLabel } from './StyledScheduleModal';
import dayjs from 'dayjs';

type SelectCalendarDateProps = {
  title?: string;
  withMargin?: boolean;
  shouldDisableDay?: (date: dayjs.Dayjs) => boolean | boolean;
  renderAvailableDay?: (props: PickersDayProps<dayjs.Dayjs>) => JSX.Element;
  handleSelectDate: (e: dayjs.Dayjs) => void;
  selectedDates: dayjs.Dayjs[] | null;
};

const CustomDay = (props: PickersDayProps<dayjs.Dayjs> & { selectedDays: dayjs.Dayjs[] }) => {
  const { selectedDays, day, ...other } = props;
  const isSelected = selectedDays.some((selectedDay) => day.isSame(selectedDay, 'day'));

  return <PickersDay {...other} day={day} selected={isSelected} />;
};

export const SelectCalendarDate = ({
  shouldDisableDay,
  renderAvailableDay,
  handleSelectDate,
  selectedDates,
  title = 'Fecha',
  withMargin = false,
}: SelectCalendarDateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      my: withMargin ? '1rem' : '0',
    }}
  >
    <StyledLabel>{title}</StyledLabel>
    <DateCalendar
      shouldDisableDate={shouldDisableDay ? shouldDisableDay : () => false}
      disablePast={true}
      slots={{
        day:
          renderAvailableDay ||
          ((props) => <CustomDay {...props} selectedDays={selectedDates || []} />),
      }}
      slotProps={{
        day: {
          // @ts-ignore
          selectedDays: selectedDates,
        },
      }}
      onChange={handleSelectDate}
      showDaysOutsideCurrentMonth
    />
  </Box>
);

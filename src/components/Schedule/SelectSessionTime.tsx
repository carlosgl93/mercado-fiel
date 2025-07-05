import { Box } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';
import { StyledLabel, StyledDateTimePicker } from './StyledScheduleModal';
import { Text } from '../StyledComponents';
import { useCallback } from 'react';
import { Appointment } from '@/api/appointments';
import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';

export const SelectSessionTime = ({
  selectedTimes,
  availableTimesStep,
  selectedDates,
  handleSelectSessionHour,
  providerAppointments,
  serviceDuration = 0,
  providerAvailability,
}: // shouldDisableTime,
{
  selectedTimes: {
    [x: number]: dayjs.Dayjs;
    length?: number | undefined;
    toString?: (() => string) | undefined;
    toLocaleString?:
      | {
          (): string;
          (
            locales: string | string[],
            options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions,
          ): string;
        }
      | undefined;
  } | null;
  availableTimesStep: number | undefined;
  selectedDates: dayjs.Dayjs[] | null;
  handleSelectSessionHour: (date: dayjs.Dayjs, time: dayjs.Dayjs) => void;
  // shouldDisableTime: (time: dayjs.Dayjs) => boolean;
  providerAppointments: Appointment[] | undefined;
  serviceDuration: number | undefined;
  providerAvailability: AvailabilityData[] | undefined;
}) => {
  // i think current selected date would be better defined as the date that does not have a time selected yet
  const currentSelectedDate =
    selectedDates?.filter(
      (date) => !selectedTimes?.[date.format('YYYY-MM-DD') as unknown as number],
    )[0] || selectedDates?.[selectedTimes ? Object.keys(selectedTimes).length : 0];

  const formattedDate = currentSelectedDate?.format('YYYY-MM-DD');
  // @ts-ignore
  const selectedTime = formattedDate ? selectedTimes?.[formattedDate]?.[0] : null;

  const shouldDisableTime = useCallback(
    (time: Dayjs) => {
      const selectedDays = selectedDates;
      const completeTime = time.format('HH:mm');
      const timeHour = time.get('hours');
      const timeMinutes = time.get('minutes');

      // Check if the selected time slot is already booked
      const isSomeTimeSlotBooked = providerAppointments?.find((appointment) => {
        const appointmentStartTime = dayjs(appointment.scheduledTime, 'HH:mm');
        const appointmentEndTime = appointmentStartTime.add(serviceDuration, 'minutes');
        const serviceStartTime = dayjs(completeTime, 'HH:mm');
        const serviceEndTime = serviceStartTime.add(serviceDuration, 'minutes');

        return selectedDays?.find((selectedDay) => {
          if (
            appointment.scheduledTime === completeTime &&
            appointment.scheduledDate === currentSelectedDate?.format('YYYY-MM-DD')
          ) {
            return true;
          }

          // This conditional checks if the current time slot should be disabled based on the following criteria:
          // 1. The appointment date matches the selected schedule date.
          // 2. The appointment does not end before the service start time.
          // 3. The appointment does not start after the service end time.
          // 4. The current time is not before the appointment start time.
          // 5. The current time is not after the appointment end time.
          // This ensures that time slots overlapping with or within the duration of an existing appointment are disabled.
          return (
            dayjs(appointment.scheduledDate).format('YYYY-MM-DD') ===
              selectedDay?.format('YYYY-MM-DD') &&
            !appointmentEndTime.isBefore(serviceStartTime) &&
            !appointmentStartTime.isAfter(serviceEndTime) &&
            !(time <= appointmentStartTime) &&
            !(time >= dayjs(appointmentEndTime))
          );
        });
      });

      if (isSomeTimeSlotBooked) {
        return true;
      }

      const isTimeUnavailable = selectedDays?.some((selectedDay) => {
        const dayAvailability = providerAvailability?.find((d) => d?.id === selectedDay?.day());
        if (dayAvailability && dayAvailability?.isAvailable) {
          // validation when provider is available all day
          if (
            dayAvailability.times.startTime === '00:00' &&
            (dayAvailability.times.endTime === '23:59' || dayAvailability.times.endTime === '0:0')
          ) {
            return false;
          }
          const startTimeSplit = dayAvailability.times.startTime.split(':');
          const endTimeSplit = dayAvailability.times.endTime.split(':');

          const startHour = startTimeSplit[0];
          const endHour = endTimeSplit[0];
          const startMinutes = startTimeSplit[1];
          const endMinutes = endTimeSplit[1];

          if (
            Number(startHour) > timeHour ||
            Number(endHour) < timeHour ||
            (Number(endHour) === timeHour && Number(endMinutes) <= timeMinutes) ||
            (Number(startHour) === timeHour && Number(startMinutes) > timeMinutes)
          ) {
            return true;
          }
          (Number(startHour) === timeHour || Number(endHour) === timeHour) &&
            (Number(endMinutes) < timeMinutes || Number(startMinutes) > timeMinutes);
        }
        return false;
      });

      return isTimeUnavailable ? isTimeUnavailable : false;
    },
    [
      providerAvailability,
      providerAppointments,
      selectedDates,
      selectedTimes?.length,
      currentSelectedDate?.toString(),
    ],
  );
  return (
    <Box
      id="select-session-time"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <StyledLabel>Horas disponibles </StyledLabel>
      <Text>Selecciona una hora para el día: </Text>
      <strong>{currentSelectedDate?.format('DD/MM/YYYY')}</strong>
      <StyledDateTimePicker
        sx={{ mt: '1rem' }}
        referenceDate={currentSelectedDate as Dayjs}
        shouldDisableTime={shouldDisableTime}
        skipDisabled
        ampm={false}
        value={selectedTime ? selectedTime : null}
        timeStep={availableTimesStep}
        onChange={(time) => handleSelectSessionHour(currentSelectedDate as Dayjs, time)}
      />
    </Box>
  );
};

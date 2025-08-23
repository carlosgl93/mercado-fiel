import { Appointment, ScheduleAppointmentParams, scheduleService } from '@/api/appointments';
import { updateAppointment } from '@/api/appointments/updateAppointment';
import { createTransaction } from '@/api/payments';
import { useAppointments } from '@/hooks/useAppointments';
import { usePerfilPrestador } from '@/pages/PerfilProveedor/usePerfilProveedor';
import { useLoading } from '@/store/global';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import { scheduleState } from '@/store/schedule/sheduleState';
import { notificationState } from '@/store/snackbar';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { Badge, SelectChangeEvent } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';
import { SupplierWithProducts } from '../../models';

export const ScheduleController = () => {
  const prestador = useRecoilValue(interactedProveedorState);
  const { setLoading } = useLoading();
  const { handleCloseScheduleModal } = usePerfilPrestador(prestador as SupplierWithProducts);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [waitingForPayku, setWaitingForPayku] = useState(false);
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  const setNotification = useSetRecoilState(notificationState);
  const [value, setValue] = useState<Dayjs | null>(null);
  const providerAvailability = prestador?.availability;
  const { providersAppointments, providersAppointmentsLoading } = useAppointments();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { user } = useAuth();
  const {
    isMultiple,
    selectedDates,
    selectedTimes,
    howManySessionsToConfirm,
    howManySessionsToSchedule,
  } = schedule;
  const now = dayjs();

  useEffect(() => {
    const button = document.getElementById('agendar-button');
    if (button) {
      if (isButtonEnabled) {
        button.classList.add('enabled-animation');
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        button.classList.remove('enabled-animation');
      }
    }
  }, [isButtonEnabled]);

  useEffect(() => {
    const isEnabled =
      !!selectedDates &&
      !!selectedTimes &&
      !scheduleServiceLoading &&
      !waitingForPayku &&
      howManySessionsToSchedule <= selectedDates.length &&
      howManySessionsToSchedule <= Object.keys(selectedTimes).length;

    setIsButtonEnabled(isEnabled);
  }, [selectedDates, selectedTimes, waitingForPayku, howManySessionsToSchedule]);

  useEffect(() => {
    if (selectedDates?.length === howManySessionsToSchedule) {
      const timesToSchedule = document.getElementById('select-session-time');
      if (timesToSchedule) {
        timesToSchedule.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDates, howManySessionsToSchedule]);

  const shouldDisableDay = (date: dayjs.Dayjs) => {
    // if (date.isBefore(now)) {
    //   return true;
    // }
    // Calculate the current time plus 24 hours to get the cutoff time
    const cutoffTime = now.add(24, 'hour');
    // Disable the date if it is less than 24 hours from the current time
    // Note: We use .startOf('day') to compare only the date part, ignoring the time
    if (date.diff(cutoffTime, 'days', true) < 0) {
      return true;
    }
    // Disable the date if the provider is not available on this day of the week
    const dayAvailability = providerAvailability?.find((d) => d?.id === date.get('day'));
    // If the day is not available, return true to disable it
    return !dayAvailability?.isAvailable;
  };
  const renderAvailableDay = (
    props: PickersDayProps<dayjs.Dayjs> & { selectedDays?: dayjs.Dayjs[] },
  ) => {
    // const renderedDayIsPast = props.day.isBefore(now);
    const { selectedDays = [], day, outsideCurrentMonth } = props;

    const isSelected =
      !outsideCurrentMonth && selectedDays?.some((selectedDay) => selectedDay.isSame(day, 'day'));

    // the day is available if the prestador availability includes that day of the week
    // and its not less than 24 hours from now
    // TODO: check if the day has all its time slots already appointed against providersAppointments
    const isAvailable = providerAvailability?.find((d) => {
      return d?.id === props.day.get('d');
    })?.isAvailable;
    //  && !renderedDayIsPast;

    if (isAvailable) {
      return (
        <Badge
          key={day.toString()}
          overlap="circular"
          sx={{
            borderRadius: '50%',
            color: 'green',
          }}
          badgeContent={
            <CheckOutlinedIcon
              sx={{
                width: '0.7rem',
              }}
              htmlColor="green"
            />
          }
        >
          <PickersDay
            {...props}
            selected={isSelected}
            sx={{
              color: 'black',
            }}
          />
        </Badge>
      );
    }

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        sx={{
          borderRadius: '50%',
          color: isAvailable ? 'green' : 'black',
        }}
        badgeContent={
          isAvailable ? null : (
            <DoNotDisturbAltOutlinedIcon
              sx={{
                width: '0.7rem',
              }}
              htmlColor="red"
            />
          )
        }
      >
        <PickersDay
          {...props}
          color={isAvailable ? 'green' : 'red'}
          sx={{
            color: 'red',
          }}
        />
      </Badge>
    );
  };

  const handleCheckIsMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchedule((prev) => {
      if (e.target.value === 'false') {
        return {
          ...prev,
          isMultiple: false,
          howManySessionsToSchedule: 1,
          howManySessionsToConfirm: 1,
        };
      }
      return { ...prev, isMultiple: e.target.value === 'true' };
    });
  };

  const handleSelectHowManySessionsToSchedule = (e: SelectChangeEvent<string>) => {
    setSchedule((prev) => {
      return { ...prev, howManySessionsToSchedule: Number(e.target.value) };
    });
  };

  const handleSelectHowManySessionsToConfirm = (e: SelectChangeEvent<number>) => {
    setSchedule((prev) => {
      return { ...prev, howManySessionsToConfirm: Number(e.target.value) };
    });
  };

  const handleSelectDate = useCallback(
    (e: Dayjs) => {
      setSchedule((prev) => {
        if (schedule.isMultiple) {
          // case where the user selects a date that was already selected: removes selected
          if (prev.selectedDates?.some((date) => date.isSame(e))) {
            const newSelectedDates = prev.selectedDates
              .filter((date) => !date.isSame(e))
              .sort((a, b) => (a.isAfter(b) ? 1 : -1));
            const newSelectedTimes = { ...prev.selectedTimes };
            delete newSelectedTimes[e.format('YYYY-MM-DD') as unknown as number];
            return { ...prev, selectedDates: newSelectedDates, selectedTimes: newSelectedTimes };
          } else if (prev?.selectedDates?.length === howManySessionsToSchedule) {
            // case where the user selects a date and the limit of dates is reached: removes the first selected date and adds the new one
            const newSelectedTimes = { ...prev.selectedTimes };
            let newSelectedDates = [...prev.selectedDates];
            delete newSelectedTimes[newSelectedDates[0].format('YYYY-MM-DD') as unknown as number];
            newSelectedDates = [...prev.selectedDates.slice(1), e].sort((a, b) =>
              a.isAfter(b) ? 1 : -1,
            );
            // @ts-ignore
            return { ...prev, selectedDates: newSelectedDates, selectedTimes: newSelectedTimes };
          } else {
            const newSelectedDates = prev.selectedDates
              ? [...prev.selectedDates, e].sort((a, b) => (a.isAfter(b) ? 1 : -1))
              : [e];
            return { ...prev, selectedDates: newSelectedDates };
          }
        } else {
          return { ...prev, selectedDates: [e] };
        }
      });
    },
    [schedule.isMultiple, howManySessionsToSchedule],
  );

  const handleSelectSessionHour = useCallback(
    (date: Dayjs, time: Dayjs) => {
      setSchedule((prev) => {
        console.log('previous selected times', prev.selectedTimes);
        const newSelectedTimes = { ...prev.selectedTimes };
        const dateKey = date.format('YYYY-MM-DD');

        // Set the time for the given date
        // @ts-ignore
        newSelectedTimes[dateKey] = time;
        console.log('new selected times', newSelectedTimes);

        return { ...prev, selectedTimes: newSelectedTimes };
      });
    },
    [schedule.isMultiple, howManySessionsToSchedule, selectedDates],
  );

  const handleSubmit = () => {
    navigate('/booking-confirmation');
    return;
  };

  const handleConfirmBooking = () => {
    setLoading(true);

    const scheduledTimes = selectedDates!.map((date) => ({
      date: date.format('YYYY-MM-DD'),
      time: selectedTimes![date.format('YYYY-MM-DD') as unknown as number].format('HH:mm'),
    }));

    if (prestador && user) {
      const provider = {
        id: prestador.id,
        firstname: prestador.firstname,
        lastname: prestador.lastname,
        email: prestador.email,
      };
      const customer = {
        id: String(user.data.id_usuario),
        firstname: user.data.nombre.split(' ')[0] || '',
        lastname: user.data.nombre.split(' ')[1] || '',
        email: user.data.email,
      };

      scheduleServiceMutate(
        scheduledTimes.map(
          ({ date, time }) =>
            ({
              provider,
              customer,
              scheduledDate: date,
              scheduledTime: time,
              status: 'Pendiente de pago',
              rating: 0,
              confirmedByUser: false,
              isMultiple,
              howManySessionsToConfirm,
              totalPaidScheduling: Number(0) * (howManySessionsToConfirm || 1),
              providersAvailability: providerAvailability,
            } as ScheduleAppointmentParams),
        ),
      );
    }
  };

  const handleSendUserToPayku = async (paykuParams: {
    appointments: Appointment[];
    totalToPay: number;
    sessionsToConfirm: number;
  }) => {
    setWaitingForPayku(!waitingForPayku);
    const paykuRes = await createTransaction(paykuParams);
    if (paykuRes) {
      const promises: Promise<void>[] = [];
      paykuParams.appointments.forEach(async (app) => {
        promises.push(updateAppointment(app, paykuRes));
      });
      await Promise.all(promises);
      window.location.href = paykuRes.url;
    } else {
      throw new Error('Error al crear la transacción');
    }
    setWaitingForPayku(!waitingForPayku);
  };

  const { mutate: scheduleServiceMutate, isLoading: scheduleServiceLoading } = useMutation(
    scheduleService,
    {
      onSettled: async () => {
        client.invalidateQueries(['userAppointments', user?.data.id_usuario]);
        client.invalidateQueries(['providerAppointments', prestador?.id]);
      },
      onSuccess: async (data: Appointment[]) => {
        const paykuParams = {
          appointments: data,
          totalToPay: 0, // this will be calculated below
          // totalToPay: Number(schedule.selectedService!.price) * (howManySessionsToConfirm || 1),
          sessionsToConfirm: howManySessionsToConfirm,
        };
        setSchedule({
          selectedTimes: null,
          selectedDates: null,
          isMultiple: false,
          howManySessionsToSchedule: 1,
          howManySessionsToConfirm: 1,
        });
        setValue(null);
        client.invalidateQueries(['userAppointments', user?.data.id_usuario]);
        client.invalidateQueries(['providerAppointments', prestador?.id]);
        handleSendUserToPayku(paykuParams);
        setLoading(false);
      },
      onError: async () => {
        setNotification({
          open: true,
          message: 'Error al agendar el servicio',
          severity: 'error',
        });
      },
    },
  );

  const numberOfSessionsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return {
    providersAppointmentsLoading,
    handleCloseScheduleModal,
    numberOfSessionsOptions,
    scheduleServiceLoading,
    providersAppointments,
    providerAvailability,
    waitingForPayku,
    prestador,
    schedule,
    value,
    isMultiple,
    selectedDates,
    selectedTimes,
    howManySessionsToConfirm,
    howManySessionsToSchedule,
    setValue,
    setSchedule,
    handleSubmit,
    shouldDisableDay,
    handleSelectDate,
    // shouldDisableTime,
    renderAvailableDay,
    handleConfirmBooking,
    handleCheckIsMultiple,
    handleSelectSessionHour,
    handleSelectHowManySessionsToConfirm,
    handleSelectHowManySessionsToSchedule,
  };
};

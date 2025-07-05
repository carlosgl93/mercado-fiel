import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import dayjs from 'dayjs';
import { atom, useRecoilState } from 'recoil';

export type TScheduleState = {
  isMultiple: boolean;
  howManySessionsToConfirm: number;
  howManySessionsToSchedule: number;
  selectedService?: UserCreatedServicio;
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
  selectedDates: Array<dayjs.Dayjs> | null;
};

export const defaultScheduleState: TScheduleState = {
  isMultiple: false,
  howManySessionsToConfirm: 1,
  howManySessionsToSchedule: 1,
  selectedService: undefined,
  selectedTimes: null,
  selectedDates: null,
};

export const scheduleModalState = atom<boolean>({
  key: 'scheduleModalState',
  default: false,
});

export const scheduleState = atom<TScheduleState>({
  key: 'scheduleState',
  default: defaultScheduleState,
});

export const useSchedule = () => {
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const handleSetService = (service: UserCreatedServicio) => {
    setSchedule((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  return { schedule, handleSetService };
};

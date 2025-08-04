import dayjs from 'dayjs';
import { atom, useRecoilState } from 'recoil';

export type TScheduleState = {
  isMultiple: boolean;
  howManySessionsToConfirm: number;
  howManySessionsToSchedule: number;
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

  return { schedule };
};

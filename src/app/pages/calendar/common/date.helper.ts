import { DateParams } from './calendar.models';

const lastDateOfMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

export const coerceDate = ({ year, month, day }: DateParams): DateParams => {
  year = Math.max(1970, year);
  year = Math.min(year, 9999);
  month = Math.max(1, month);
  month = Math.min(month, 12);
  day = Math.max(1, day);
  day = Math.min(day, lastDateOfMonth(year, month));

  return { year, month, day };
}

export const getDate = ({ year, month, day }: DateParams): Date => {
  return new Date(year, month - 1, day);
}

export const isTodayDate = (date: Date | null): boolean => {
  if (!date) {
    return false;
  }
  return new Date().setHours(0,0,0,0) === date.setHours(0,0,0,0);
}

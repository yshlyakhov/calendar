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

import { Params } from '@angular/router';

export interface DateParams {
  year: number;
  month: number;
  day: number;
}

export const isDateParams = (object: Params): object is DateParams => {
  return Object.values(object).every((value) => !isNaN(value));
}

export interface CalendarDayPageData {
  dateParams: DateParams|null;
}

export interface CalendarState {
  dateParams: DateParams;
}

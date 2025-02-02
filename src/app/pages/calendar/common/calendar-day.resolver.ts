import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, ResolveFn } from '@angular/router';
import { CalendarDayPageData, DateParams } from './calendar.models';
import { coerceDate } from './date.helper';

export const calendarDayResolver: ResolveFn<CalendarDayPageData> = (
  { params }: ActivatedRouteSnapshot
): MaybeAsync<CalendarDayPageData | RedirectCommand> => {
  const { year, month, day } = params;
  const dateParams: DateParams|null = Object.keys(params).length > 0 ? coerceDate({ year, month, day }) : null;

  return {
    dateParams
  };
}

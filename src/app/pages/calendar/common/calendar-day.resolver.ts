import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, ResolveFn } from '@angular/router';
import { CalendarDayPageData, DateParams } from './calendar.models';
import { coerceDate } from './date.helper';
import { inject } from '@angular/core';
import { CalendarStateService } from './calendar-state.service';

export const calendarDayResolver: ResolveFn<CalendarDayPageData> = (
  { params }: ActivatedRouteSnapshot
): MaybeAsync<CalendarDayPageData | RedirectCommand> => {
  const calendarStateService = inject(CalendarStateService);
  const { year, month, day } = params;
  const dateParams: DateParams|null = Object.keys(params).length > 0 ? coerceDate({ year, month, day }) : null;
  calendarStateService.update('dateParams', dateParams);

  return {
    dateParams
  };
}

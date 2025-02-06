import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { CalendarDayPageData, DateParams } from '@pages/calendar/common/calendar.models';
import { coerceDate } from '@pages/calendar/common/date.helper';

export const calendarDayResolver: ResolveFn<CalendarDayPageData> = (
  { params }: ActivatedRouteSnapshot
): MaybeAsync<CalendarDayPageData | RedirectCommand> => {
  const calendarStateService = inject(CalendarStateService);
  const { year, month, day } = params;
  const dateParams: DateParams|null = Object.keys(params).length > 0 ? coerceDate({ year, month, day }) : null;
  calendarStateService.update('dateParams', dateParams);

  // @todo
  return {
    dateParams
  };
}

import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { CalendarDayPageData, DateParams } from '@pages/calendar/common/calendar.models';
import { coerceDate } from '@pages/calendar/common/date.helper';
import { forkJoin, of } from 'rxjs';
import { CalendarApiService } from '@pages/calendar/common/calendar-api.service';

export const calendarDayResolver: ResolveFn<CalendarDayPageData> = (
  { params }: ActivatedRouteSnapshot
): MaybeAsync<CalendarDayPageData | RedirectCommand> => {
  const calendarApiService = inject(CalendarApiService);
  const calendarStateService = inject(CalendarStateService);
  const { year, month, day } = params;
  const dateParams: DateParams|null = Object.keys(params).length > 0 ? coerceDate({ year, month, day }) : null;
  calendarStateService.update('dateParams', dateParams);

  return forkJoin({
    dateParams: of(dateParams),
    data: calendarApiService.get(dateParams),
  });

}

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { RoutesConfig } from '@configs';
import { isDateParams } from '@pages/calendar/common/calendar.models';
import { isTodayDate, getDate } from '@pages/calendar/common/date.helper';

export const calendarDayGuard: CanActivateChildFn = (
  { params }: ActivatedRouteSnapshot,
): MaybeAsync<GuardResult> => {
  const router = inject(Router);

  if (isDateParams(params) && isTodayDate(getDate(params))) {
    return router.createUrlTree([RoutesConfig.calendar.calendar, RoutesConfig.calendar.today]);
  }
  return isDateParams(params)|| router.createUrlTree([RoutesConfig.general.root, RoutesConfig.general.notFound]);
}

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { RoutesConfig } from '@configs';
import { isDateParams } from './calendar.models';
import { getDate, isTodayDate } from './date.helper';

export const calendarDayGuard: CanActivateChildFn = (
  { params }: ActivatedRouteSnapshot,
): MaybeAsync<GuardResult> => {
  const router = inject(Router);

  console.log(params);

  if (isDateParams(params) && isTodayDate(getDate(params))) {
    return router.createUrlTree([RoutesConfig.calendar.calendar, RoutesConfig.calendar.today]);
  }

  return isDateParams(params)|| router.createUrlTree([RoutesConfig.general.root, RoutesConfig.general.notFound]);
}

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { RoutesConfig } from '@configs';
import { isDateParams } from './calendar.models';

export const calendarDayGuard: CanActivateChildFn = (
  { params }: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const router = inject(Router);

  return isDateParams(params) || router.createUrlTree([RoutesConfig.general.root, RoutesConfig.general.notFound]);
}

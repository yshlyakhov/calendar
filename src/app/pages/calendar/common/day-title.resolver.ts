import { ResolveFn, ActivatedRouteSnapshot, MaybeAsync } from '@angular/router';
import { coerceDate, getDateHash } from './date.helper';
import { DateParams } from './calendar.models';

export const dayTitleResolver: ResolveFn<string> = (
  { params }: ActivatedRouteSnapshot
): MaybeAsync<string> => {
  return getDateHash(coerceDate(params as DateParams));
}

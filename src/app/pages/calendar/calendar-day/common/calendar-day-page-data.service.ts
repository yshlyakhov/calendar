import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, ReplaySubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Appointment, CalendarDayPageData } from '@pages/calendar/common/calendar.models';
import { getDate } from '@pages/calendar/common/date.helper';

@Injectable()
export class CalendarPageDataService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataSource = new ReplaySubject<CalendarDayPageData>(1);
  private readonly selectedDate = new ReplaySubject<Date>(1);
  private readonly appointments = new ReplaySubject<Appointment[]>(1);

  readonly selectedDate$ = this.selectedDate.asObservable();
  readonly appointments$ = this.appointments.asObservable();

  constructor(route: ActivatedRoute) {
    route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        tap(({ pageData: { dateParams, data } }) => {
          this.selectedDate.next(dateParams ? getDate(dateParams) : new Date());
          this.appointments.next(data);
        }),
      )
      .subscribe();
  }
}

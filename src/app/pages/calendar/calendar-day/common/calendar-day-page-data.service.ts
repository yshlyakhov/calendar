import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, ReplaySubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CalendarDayPageData } from '@pages/calendar/common/calendar.models';
import { getDate } from '@pages/calendar/common/date.helper';

@Injectable()
export class CalendarPageDataService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataSource = new ReplaySubject<CalendarDayPageData>(1);

  readonly dataSource$ = this.dataSource.asObservable();
  readonly selectedDate$ = this.dataSource$
    .pipe(map(({ dateParams }) => dateParams ? getDate(dateParams) : new Date()));

  constructor(route: ActivatedRoute) {
    route.data
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
        tap(({ pageData }) => {
          this.dataSource.next(pageData);
        }),
      )
      .subscribe();
  }
}

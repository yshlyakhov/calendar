import { DestroyRef, inject, Injectable } from '@angular/core';
import { CalendarDayPageData } from './calendar.models';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class CalendarPageDataService {
  private readonly destroyRef = inject(DestroyRef);
  // private readonly dataSource = new ReplaySubject<CalendarDayPageData>(1);

  constructor(route: ActivatedRoute) {
    route.data
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ pageData }) => {
        console.log(pageData);

      });
  }
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutesConfig } from '@configs';
import { URL_SERVICE } from '@shared/services/url.service';
import { CalendarPageDataService } from '../common/calendar-day-page-data.service';
import { CalendarStateService } from '../common/calendar-state.service';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalendarDayPageData } from '../common/calendar.models';
import { isTodayDate } from '../common/date.helper';

@Component({
  selector: 'app-calendar-day',
  imports: [
    DatePipe,
  ],
  providers: [
    CalendarPageDataService,
  ],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent {
  private readonly urlService = inject(URL_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly calendarStateService = inject(CalendarStateService);
  private readonly calendarPageDataService = inject(CalendarPageDataService);

  pageData: CalendarDayPageData = this.route.snapshot.data.pageData;
  selectedDate = toSignal(this.calendarPageDataService.selectedDate$);
  isToday = computed(() => isTodayDate(this.selectedDate()!));

  ngOnInit(): void {
    this.coerceUrl();
  }

  private coerceUrl(): void {
    const { dateParams } = this.pageData;
    if (dateParams) {
      const url = this.urlService.getCurrentUrl([RoutesConfig.calendar.calendar, `${dateParams.year}`, `${dateParams.month}`, `${dateParams.day}`]);
      this.urlService.changeUrl(url);
      this.calendarStateService.state.update(state => ({ ...state, dateParams }));
    }
  }
}

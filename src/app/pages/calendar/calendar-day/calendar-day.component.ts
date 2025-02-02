import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutesConfig } from '@configs';
import { URL_SERVICE } from '@shared/services/url.service';
import { CalendarPageDataService } from '../common/calendar-day-page-data.service';

@Component({
  selector: 'app-calendar-day',
  imports: [],
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
  private readonly calendarPageDataService = inject(CalendarPageDataService);

  pageData = this.route.snapshot.data.pageData;

  ngOnInit(): void {
    const { dateParams } = this.pageData;
    if (dateParams) {
      const url = this.urlService.getCurrentUrl([RoutesConfig.calendar.calendar, dateParams.year, dateParams.month, dateParams.day]);
      this.urlService.changeUrl(url);
    }
  }
}

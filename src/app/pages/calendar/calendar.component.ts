import { ChangeDetectionStrategy, Component, effect, inject, model, viewChild } from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { Router, RouterOutlet } from '@angular/router';
import { RoutesConfig } from '@configs';
import { CalendarStateService } from './common/calendar-state.service';
import { DatePipe } from '@angular/common';
import { getDate, isTodayDate } from './common/date.helper';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar',
  imports: [
    RouterOutlet,
    MatDatepickerModule,
    DatePipe,
    MatButtonModule,
  ],
  providers: [

  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private readonly router = inject(Router);
  private readonly calendarStateService = inject(CalendarStateService);
  calendar = viewChild<MatCalendar<Date>>('calendar');
  selected = model<Date | null>(null);

  constructor() {
    effect(() => {
      const dateParams = this.calendarStateService.state()?.dateParams;
      const date = dateParams ? getDate(dateParams) : new Date();
      this.selected.set(date);
      this.calendar()?._goToDateInView(date, 'month');
    });
  }

  dateChanged(date: Date): void {
    let commands;
    if (isTodayDate(this.selected())) {
      commands = [RoutesConfig.calendar.calendar, RoutesConfig.calendar.today];
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      commands = [RoutesConfig.calendar.calendar, year, month, day];
    }
    this.router.navigate(commands);
  }

  setToday(): void {
    const date = new Date();
    this.selected.set(date);
    // this.dateChanged(date);
    this.router.navigate([RoutesConfig.calendar.calendar, RoutesConfig.calendar.today]);
    this.calendar()?._goToDateInView(date, 'month');
  }
}

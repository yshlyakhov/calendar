import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, effect, inject, model, viewChild } from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { Router, RouterOutlet } from '@angular/router';
import { RoutesConfig } from '@configs';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppointmentService } from './appointment/common/appointment.service';
import { CalendarStateService } from './common/calendar-state.service';
import { DateParams, AppointmentCreateData, Appointment } from './common/calendar.models';
import { getDate, isTodayDate, getDateParams } from './common/date.helper';

@Component({
  selector: 'app-calendar',
  imports: [
    RouterOutlet,
    MatDatepickerModule,
    DatePipe,
    MatButtonModule,

    JsonPipe, // @todo
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly calendarStateService = inject(CalendarStateService);
  private readonly appointmentService = inject(AppointmentService);

  readonly title = 'Calendar app';
  readonly calendar = viewChild<MatCalendar<Date>>('calendar');
  readonly selected = model<Date | null>(null);
  readonly appointmmentAction$ = new Subject<void>();

  readonly state = this.calendarStateService.signal(); // @todo

  constructor() {
    effect(() => {
      const dateParams = this.calendarStateService.select<DateParams>('dateParams');
      const date = dateParams ? getDate(dateParams) : new Date();
      this.selected.set(date);
      this.calendar()?._goToDateInView(date, 'month'); // sync calendar view with selected date
    });
  }

  ngOnInit(): void {
    this.handleAppointmentAction();
  }

  dateChanged(date: Date): void {
    let commands;
    if (isTodayDate(this.selected())) {
      commands = [RoutesConfig.calendar.calendar, RoutesConfig.calendar.today];
    } else {
      const { year, month, day } = getDateParams(date);
      commands = [RoutesConfig.calendar.calendar, year, month, day];
    }
    this.router.navigate(commands);
  }

  setToday(): void {
    const date = new Date();
    this.selected.set(date);
    this.router.navigate([RoutesConfig.calendar.calendar, RoutesConfig.calendar.today]);
    this.calendar()?._goToDateInView(date, 'month');
  }

  private handleAppointmentAction(): void {
    this.appointmmentAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          const dateParams = this.calendarStateService.select<DateParams>('dateParams');
          const date = dateParams ? getDate(dateParams) : new Date();
          return this.appointmentService.create<AppointmentCreateData, Appointment|null>({ date });
        }),
        filter(Boolean),
        tap(result => this.appointmentService.updateState(result)),
        tap(() => this.cdr.detectChanges()), // cruth to rerender view after returng from dialog context
      )
      .subscribe();
  }

}

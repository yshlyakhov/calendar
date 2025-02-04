import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, inject, model, Signal, signal } from '@angular/core';
import { RoutesConfig } from '@configs';
import { URL_SERVICE } from '@shared/services/url.service';
import { CalendarPageDataService } from '../common/calendar-day-page-data.service';
import { CalendarStateService } from '../common/calendar-state.service';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Appointment, AppointmentCreateData, DateParams, DAY_SCHEDULE } from '../common/calendar.models';
import { getDate, isTodayDate } from '../common/date.helper';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AppointmentService } from '../common/appointment.service';
import { filter, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-calendar-day',
  imports: [
    DatePipe,
    AppointmentComponent,
  ],
  providers: [
    CalendarPageDataService,
  ],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly urlService = inject(URL_SERVICE);
  private readonly calendarStateService = inject(CalendarStateService);
  private readonly calendarPageDataService = inject(CalendarPageDataService);
  private readonly appointmentService = inject(AppointmentService);

  selectedDate = toSignal(this.calendarPageDataService.selectedDate$);
  isToday = computed(() => isTodayDate(this.selectedDate()!));
  readonly daySchedule = signal(DAY_SCHEDULE);
  readonly dragging = model<boolean>(false);
  readonly appointmentAction$ = new Subject<number>();
  readonly appointments: Signal<Appointment[]> = computed(() => {
    const state = this.calendarStateService.signal();
    return state()[this.calendarStateService.getDateHash()] || [];
  });

  ngOnInit(): void {
    this.coerceUrl();
    this.handleAppointmentAction();
  }

  /**
   * calendarDayResolver may have changed manually entered url path by coerceDate Fn
   * given above condition we should updte route without page reloading
   */
  private coerceUrl(): void {
    const dateParams = this.calendarStateService.select<DateParams>('dateParams');
    if (dateParams) {
      const url = this.urlService.getCurrentUrl([RoutesConfig.calendar.calendar, `${dateParams.year}`, `${dateParams.month}`, `${dateParams.day}`]);
      this.urlService.changeUrl(url);
    }
  }

  private handleAppointmentAction(): void {
    this.appointmentAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(timeslot => {
          const dateParams = this.calendarStateService.select<DateParams>('dateParams');
          const date = dateParams ? getDate(dateParams) : new Date();
          return this.appointmentService.create<AppointmentCreateData, Appointment|null>({ date, timeslot });
        }),
        filter(Boolean),
        tap((result) => this.appointmentService.updateState(result)),
        tap(() => this.cdr.detectChanges()), // cruth to rerender view after returng from dialog context
      )
      .subscribe();
  }
}

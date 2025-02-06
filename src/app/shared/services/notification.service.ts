import { formatDate } from '@angular/common';
import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { Appointment } from '@pages/calendar/common/calendar.models';
import { MINUTE } from '@pages/calendar/common/date.helper';
import { interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    private readonly calendarStateService = inject(CalendarStateService);
    private readonly locale = inject(LOCALE_ID);

    constructor() {
      Notification.requestPermission().then(permission => {
        if (permission) {
          this.handleNotification();
        }
      });
    }

    /**
     * basic example
     * notification logic should be improved based on requirements
     */
    private handleNotification(): void {
      interval(MINUTE * 5)
        .pipe(
          tap(() => {
            const upcomingAppointments = this.getUpcomingAppointments();
            if (upcomingAppointments?.length) {
              upcomingAppointments.forEach(({ title, startTime }) => new Notification(`${title || '(No title)'}: starts at ${formatDate(startTime, 'shortTime', this.locale)}`));
            }
          })
        )
        .subscribe();
    }

    private getUpcomingAppointments(): Appointment[]|null {
      const todayAppointments = this.calendarStateService.select<Appointment[]>('today');
      if (todayAppointments?.length > 0) {
        return todayAppointments.filter(({ startTime }) => {
          const time = (new Date(startTime).getTime() - Date.now()) / MINUTE;
          return time > 1 && time <= 15;
        });
      }
      return null;
    }

}

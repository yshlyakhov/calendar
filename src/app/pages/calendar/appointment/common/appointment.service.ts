import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentCreateModalComponent } from '@pages/calendar/appointment/appointment-create-modal/appointment-create-modal.component';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { Appointment, AppointmentAction, DateParams } from '@pages/calendar/common/calendar.models';
import { coerceAppointmentDate, getDateHash, getDateParams } from '@pages/calendar/common/date.helper';
import { Observable, Subject } from 'rxjs';
import { AppointmentViewModalComponent } from '../appointment-view-modal/appointment-view-modal.component';
import { AppointmentEditModalComponent } from '../appointment-edit-modal/appointment-edit-modal.component';
import { CalendarApiService } from '@pages/calendar/common/calendar-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly dialog = inject(MatDialog);
  private readonly calendarStateService = inject(CalendarStateService);
  private readonly calendarApiService = inject(CalendarApiService);
  readonly refresh$ = new Subject<void>;

  create<D, R>(data?: D): Observable<R> {
    return this.dialog.open(AppointmentCreateModalComponent, { data }).afterClosed();
  }

  view(data: Appointment): Observable<AppointmentAction|null> {
    return this.dialog.open(AppointmentViewModalComponent, { data }).afterClosed();
  }

  edit(data: Appointment): Observable<Appointment|null> {
    return this.dialog.open(AppointmentEditModalComponent, { data }).afterClosed();
  }

  delete(data: Appointment): Observable<null> {
    return this.updateState(AppointmentAction.DELETE, data);
  }

  getAppointmentsByHash(dateParams: DateParams): Observable<Appointment[]> {
    return this.calendarApiService.get(dateParams);
  }

  clearAppointments(): Observable<null> {
    return this.calendarApiService.clear();
  }

  updateState(action: AppointmentAction, data: Appointment): Observable<null> {
    const key = getDateHash(getDateParams(data.date));
    let appointments = this.calendarStateService.select<Appointment[]>(key) || [];
    data.lastModified = Date.now();

    switch (action) {
      case AppointmentAction.CREATE:
        appointments.push(data);
        break;
      case AppointmentAction.EDIT:
        const index = appointments.findIndex(({ id }) => id === data.id );
        if (index > -1) {
          appointments[index] = data;
        } else {
        // another date case
          this.calendarStateService.removeAppointmentById(data.id);
          appointments.push(data);
        }
        break;
      case AppointmentAction.DELETE:
        appointments = appointments.filter(({ id }) => id !== data.id);
        break;
    }
    this.calendarStateService.update(key, appointments);
    return this.calendarApiService.save(key, appointments);
  }

  checkTimeOverlaping(appointment: Appointment): boolean {
    const { date, startTime, endTime } = coerceAppointmentDate(appointment);
    const key = getDateHash(getDateParams(date));
    let appointments = this.calendarStateService.select<Appointment[]>(key) || [];

    if (appointments.length > 0) {
      const overlaps = appointments.filter(item => {
        const { startTime: start, endTime: end } = coerceAppointmentDate(item);
        return appointment.id !== item.id
          && (
            startTime > start && startTime < end ||
            endTime > start && endTime < end ||
            startTime <= start && startTime <= end && endTime >= start && endTime >= end
          )
      }).length;

      return overlaps > 0;
    }
    return false;
  }
}

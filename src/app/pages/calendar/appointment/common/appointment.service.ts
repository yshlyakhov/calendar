import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentCreateModalComponent } from '@pages/calendar/appointment/appointment-create-modal/appointment-create-modal.component';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { Appointment, AppointmentAction } from '@pages/calendar/common/calendar.models';
import { getDateHash, getDateParams } from '@pages/calendar/common/date.helper';
import { Observable } from 'rxjs';
import { AppointmentViewModalComponent } from '../appointment-view-modal/appointment-view-modal.component';

@Injectable()
export class AppointmentService {
  private readonly dialog = inject(MatDialog);
  private readonly calendarStateService = inject(CalendarStateService);

  create<D, R>(data?: D): Observable<R> {
    return this.dialog.open(AppointmentCreateModalComponent, { data }).afterClosed();
  }

  view(data: Appointment): Observable<AppointmentAction|null> {
    return this.dialog.open(AppointmentViewModalComponent, { data }).afterClosed();
  }

  // @todo
  edit(data: Appointment): void {

  }

  delete(data: Appointment): void {
    this.updateState(AppointmentAction.DELETE, data);
  }

  // @todo
  updateState(action: AppointmentAction, data: Appointment): void {
    const key = getDateHash(getDateParams(data.date!));
    let appointments = this.calendarStateService.select<Appointment[]>(key) || [];

    switch (action) {
      case AppointmentAction.CREATE:
        appointments.push(data);
        break;
      case AppointmentAction.EDIT:
        break;
      case AppointmentAction.DELETE:
        appointments = appointments.filter(({ id }) => id !== data.id);
        break;
    }
    this.calendarStateService.update(key, appointments);
  }
}

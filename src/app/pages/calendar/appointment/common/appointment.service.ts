import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentCreateModalComponent } from '@pages/calendar/appointment/appointment-create-modal/appointment-create-modal.component';
import { CalendarStateService } from '@pages/calendar/common/calendar-state.service';
import { Appointment } from '@pages/calendar/common/calendar.models';
import { getDateHash, getDateParams } from '@pages/calendar/common/date.helper';
import { Observable } from 'rxjs';

@Injectable()
export class AppointmentService {
  private readonly dialog = inject(MatDialog);
  private readonly calendarStateService = inject(CalendarStateService);

  create<D, R>(data?: D): Observable<R> {
    return this.dialog.open(AppointmentCreateModalComponent, { data }).afterClosed();
  }

  updateState(result: Appointment): void {
    const key = getDateHash(getDateParams(result.date!));
    const appointments = this.calendarStateService.select<Appointment[]>(key) || [];
    appointments.push(result);
    this.calendarStateService.update(key, appointments);
  }
}

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentCreateModalComponent } from '../appointment-create-modal/appointment-create-modal.component';
import { Observable } from 'rxjs';
import { CalendarStateService } from './calendar-state.service';
import { Appointment } from './calendar.models';

@Injectable()
export class AppointmentService {
  private readonly dialog = inject(MatDialog);
  private readonly calendarStateService = inject(CalendarStateService);

  create<D, R>(data?: D): Observable<R> {
    return this.dialog.open(AppointmentCreateModalComponent, { data }).afterClosed();
  }

  updateState<R>(result: R): void {
    const key = this.calendarStateService.getDateHash(); // @todo should depends on DATE from result
    const appointments = this.calendarStateService.select<Appointment[]>(key) || [];
    appointments.push(new Appointment());
    this.calendarStateService.update(key, appointments);
  }
}

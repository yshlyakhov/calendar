import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentCreateModalComponent } from '../appointment-create-modal/appointment-create-modal.component';
import { Observable } from 'rxjs';

@Injectable()
export class AppointmentService {
  private readonly dialog = inject(MatDialog);

  create<Data, Result>(data?: Data): Observable<Result> {
    return this.dialog.open(AppointmentCreateModalComponent, { data }).afterClosed();
  }
}

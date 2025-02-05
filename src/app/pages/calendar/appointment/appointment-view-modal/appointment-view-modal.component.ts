import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Appointment, AppointmentAction } from '@pages/calendar/common/calendar.models';

@Component({
  selector: 'app-appointment-view-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './appointment-view-modal.component.html',
  styleUrl: './appointment-view-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentViewModalComponent {
  readonly appointment = inject<Appointment>(MAT_DIALOG_DATA);
  readonly appointmentAction = AppointmentAction;
}

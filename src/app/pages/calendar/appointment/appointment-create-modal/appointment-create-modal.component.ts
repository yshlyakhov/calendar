import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AppointmentCreateData, Appointment } from '@pages/calendar/common/calendar.models';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment-create-modal',
  imports: [
    AppointmentFormComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './appointment-create-modal.component.html',
  styleUrl: './appointment-create-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCreateModalComponent {
  readonly data = inject<AppointmentCreateData>(MAT_DIALOG_DATA);
  readonly formInvalid = model<boolean>();
  readonly formValue = model<Appointment>();
}

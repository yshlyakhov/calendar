import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment, AppointmentAction } from '@pages/calendar/common/calendar.models';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment-edit-modal',
  imports: [
    AppointmentFormComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './appointment-edit-modal.component.html',
  styleUrl: './appointment-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentEditModalComponent {
  readonly data = inject<Appointment>(MAT_DIALOG_DATA);
  readonly formInvalid = model<boolean>();
  readonly formValue = model<Appointment>();
  readonly mode = AppointmentAction.EDIT;
}

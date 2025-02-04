import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment-create-modal',
  imports: [
    AppointmentFormComponent,
  ],
  templateUrl: './appointment-create-modal.component.html',
  styleUrl: './appointment-create-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCreateModalComponent {

}

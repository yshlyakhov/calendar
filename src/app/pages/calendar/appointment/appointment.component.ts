import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentViewModalComponent } from './appointment-view-modal/appointment-view-modal.component';
import { AppointmentPositionDirective } from './common/appointment-position.directive';

@Component({
  selector: 'app-appointment',
  imports: [

  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
  hostDirectives: [
    {
      directive: CdkDrag,
      inputs: ['cdkDragBoundary', 'cdkDragLockAxis'],
      outputs: ['cdkDragStarted'],
    },
    {
      directive: AppointmentPositionDirective,
      inputs: ['appointment'],
    },
  ],
  host: {
    '(click)': 'handleClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent {
  private readonly dialog = inject(MatDialog);
  readonly dragging = model<boolean>();

  handleClick(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    /**
     * to separate drag and click events
     */
    if (this.dragging()) {
      this.dragging.set(false);
      return;
    }
    this.showAppointmentDetails();
  }

  private showAppointmentDetails(): void {
    this.dialog.open(AppointmentViewModalComponent);
  }
}

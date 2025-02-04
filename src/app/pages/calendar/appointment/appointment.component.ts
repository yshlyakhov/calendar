import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, ElementRef, inject, model, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentViewModalComponent } from '../appointment-view-modal/appointment-view-modal.component';

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
  ],
  host: {
    '(click)': 'handleClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);
  readonly dragging = model<boolean>();


  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', '0');
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', '60px');
  }

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

import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model } from '@angular/core';
import { AppointmentPositionDirective } from './common/appointment-position.directive';
import { AppointmentService } from './common/appointment.service';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { Appointment, AppointmentAction } from '../common/calendar.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment',
  imports: [
    DatePipe,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly appointmentService = inject(AppointmentService);
  readonly dragging = model<boolean>();
  readonly appointmentAction$ = new Subject<void>();
  readonly appointment = input.required<Appointment>();

  ngOnInit(): void {
    this.handleAppointmentAction();
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
    this.appointmentAction$.next();
  }

  private handleAppointmentAction(): void {
    this.appointmentAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.appointmentService.view(this.appointment())),
        filter(Boolean),
        tap((action) => {
          switch (action) {
            case AppointmentAction.DELETE:
              this.appointmentService.delete(this.appointment());
              break;
            case AppointmentAction.EDIT:
              // @todo
              break;
          }

          // this.appointmentService.updateState(result);
        }),
      )
      .subscribe();
  }

}

import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model } from '@angular/core';
import { AppointmentPositionDirective } from './common/appointment-position.directive';
import { AppointmentService } from './common/appointment.service';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { Appointment, AppointmentAction } from '../common/calendar.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { updateDateByMinutes } from '../common/date.helper';

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
      outputs: ['cdkDragStarted', 'cdkDragEnded'],
    },
    {
      directive: AppointmentPositionDirective,
      inputs: ['appointment'],
    },
  ],
  host: {
    '(click)': 'handleClick($event)',
    '(cdkDragStarted)': 'handleDragStarted($event)',
    '(cdkDragEnded)': 'handleDragEnded($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly appointmentService = inject(AppointmentService);
  readonly dragging = model<boolean>();
  readonly appointment = input.required<Appointment>();
  readonly appointmentAction$ = new Subject<void>();

  ngOnInit(): void {
    this.handleAppointmentAction();
  }

  handleClick(event: PointerEvent): void {
    // event.preventDefault();
    // event.stopPropagation();

    /**
     * to separate drag and click events
     */
    if (this.dragging()) {
      this.dragging.set(false);
      return;
    }
    this.appointmentAction$.next();
  }

  handleDragStarted(): void {
    this.dragging.set(true);
  }

  handleDragEnded(event: CdkDragEnd) {
    const { date, startTime, endTime } = this.appointment();
    const cdkDrag = event.source._dragRef;
    const targetTopPosition = cdkDrag.getFreeDragPosition().y;
    const newAppointment = {
      ...this.appointment(),
      startTime: updateDateByMinutes(startTime!, targetTopPosition),
      endTime: updateDateByMinutes(endTime!, targetTopPosition),
    };

    // reset drag drop if event overlaps with other(s)
    if (this.appointmentService.checkTimeOverlaping(newAppointment)) {
      event.source._dragRef.reset();
    } else {
    // update appointment
      this.appointmentService.updateState(AppointmentAction.EDIT, newAppointment)
    }
  }

  private handleAppointmentAction(): void {
    this.appointmentAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.appointmentService.view(this.appointment())),
        filter(Boolean),
        switchMap((action) => {
          switch (action) {
            case AppointmentAction.DELETE:
              return this.appointmentService.delete(this.appointment());
            case AppointmentAction.EDIT:
              return this.appointmentService.edit(this.appointment());
          }
        }),
        filter(Boolean),
        tap((result: Appointment) => {
          this.appointmentService.updateState(AppointmentAction.EDIT, result);
        }),
      )
      .subscribe();
  }
}

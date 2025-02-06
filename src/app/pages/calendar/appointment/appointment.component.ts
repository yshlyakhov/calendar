import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model } from '@angular/core';
import { AppointmentPositionDirective } from './common/appointment-position.directive';
import { AppointmentService } from './common/appointment.service';
import { concatMap, filter, Subject, switchMap, tap } from 'rxjs';
import { Appointment, AppointmentAction } from '../common/calendar.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { coerceAppointmentDate, updateDateByMinutes } from '../common/date.helper';

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
  readonly appointmentUpdateAction$ = new Subject<Appointment>();
  readonly appointmentAction$ = new Subject<void>();

  ngOnInit(): void {
    this.handleAppointmentUpdateAction();
    this.handleAppointmentAction();
  }

  handleClick(event: PointerEvent): void {
    /**
     * to separate drag and click events
     */
    if (this.dragging()) {
      this.dragging.set(false);
      return;
    }
    this.appointmentAction$.next();
  }

  handleDragStarted(event: CdkDragEnd): void {
    this.dragging.set(true);
  }

  handleDragEnded(event: CdkDragEnd) {
    const { startTime, endTime } = coerceAppointmentDate(this.appointment());
    const cdkDrag = event.source._dragRef;
    const targetTopPosition = cdkDrag.getFreeDragPosition().y;
    const newAppointment = {
      ...this.appointment(),
      startTime: updateDateByMinutes(startTime, targetTopPosition),
      endTime: updateDateByMinutes(endTime, targetTopPosition),
    };

    // reset drag drop if event overlaps with other(s)
    if (this.appointmentService.checkTimeOverlaping(newAppointment)) {
      event.source._dragRef.reset();
    } else {
    // update appointment
      this.appointmentUpdateAction$.next(newAppointment);
    }
  }

  private handleAppointmentUpdateAction(): void {
    this.appointmentUpdateAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        concatMap((result) => this.appointmentService.updateState(AppointmentAction.EDIT, result)),
        tap(() => this.appointmentService.refresh$.next()),
      )
      .subscribe();
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
              return this.appointmentService.delete(this.appointment())
                .pipe(tap(() => this.appointmentService.refresh$.next()));
            case AppointmentAction.EDIT:
              return this.appointmentService.edit(this.appointment());
          }
        }),
        filter(Boolean),
        switchMap((result) => this.appointmentService.updateState(AppointmentAction.EDIT, result)),
        tap(() => this.appointmentService.refresh$.next()),
      )
      .subscribe();
  }
}

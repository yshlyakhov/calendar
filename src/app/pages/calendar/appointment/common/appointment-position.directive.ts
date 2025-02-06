import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { Appointment } from '@pages/calendar/common/calendar.models';
import { coerceAppointmentDate, getMinutesOffset, MINUTE } from '@pages/calendar/common/date.helper';

@Directive({
  selector: '[appointmentPosition]',
})
export class AppointmentPositionDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  readonly appointment = input.required<Appointment>();

  ngOnInit(): void {
    this.updatePosition();
  }

  private updatePosition(): void {
    const { startTime, endTime } = coerceAppointmentDate(this.appointment());
    const top = getMinutesOffset(startTime);
    const height = (endTime.getTime() - startTime.getTime()) / MINUTE;
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${top}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${height}px`);

    // appointment has passed
    if (Date.now() > endTime.getTime()) {
      this.renderer.addClass(this.elementRef.nativeElement, 'passed');
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { CalendarState } from './calendar.models';

@Injectable()
export class CalendarStateService {
  readonly state = signal<CalendarState|null>(null);
}

import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { Appointment, CalendarState, Data, DateParams } from './calendar.models';
import { coerceAppointmentDate, getDateHash } from './date.helper';
import { CalendarStateService } from './calendar-state.service';

const generateRandomNumber = (min: number = 0, max: number = 1): number => Math.floor(Math.random() * (max - min + 1) + min);
const CALENDAR_DATA_KEY = 'calendarData';

/**
 * DASIC API SERVICE
 * get / save by data chuck just to keep sync app state and storage state
 */
@Injectable({
  providedIn: 'root',
})
export class CalendarApiService {
  private state: Data<Appointment>;

  constructor(private calendarStateService: CalendarStateService) {
    // restore state on application load
    this.state = JSON.parse(localStorage.getItem(CALENDAR_DATA_KEY) || '{}');
    calendarStateService.set(this.state as CalendarState);
  }

  get(dateParams: DateParams | null): Observable<Appointment[]> {
    return timer(generateRandomNumber(100, 300)) // emulate network delay
      .pipe(
        switchMap(() => {
          const hash = dateParams ? getDateHash(dateParams) : `today`;
          const data: Appointment[] = JSON.parse(localStorage.getItem(CALENDAR_DATA_KEY)!)?.[hash] || [];
          return of(data);
        }),
      );
  }

  save(hash: string, data: Appointment[]): Observable<null> {
    return timer(generateRandomNumber(100, 300)) // emulate network delay
      .pipe(
        switchMap(() => {
          if (data.length > 0) {
            data.forEach(item => {
              const { date, startTime, endTime } = coerceAppointmentDate(item);
              // save all dates in UTC to keep consisted dates despite user timezone
              return ({
                ...item,
                date: date.toUTCString(),
                startTime: startTime.toUTCString(),
                endTime: endTime.toUTCString()
              });
            });
            this.state[hash] = data;
          } else {
            delete this.state[hash];
          }
          localStorage.setItem(CALENDAR_DATA_KEY, JSON.stringify(this.state));

          return of(null);
        }),
      );
  }

  clear(): Observable<null> {
    return timer(generateRandomNumber(100, 300)) // emulate network delay
      .pipe(
        switchMap(() => {
          localStorage.setItem(CALENDAR_DATA_KEY, JSON.stringify({}));
          this.state = {};
          this.calendarStateService.set({ dateParams: this.calendarStateService.get().dateParams } as CalendarState);
          return of(null);
        }),
      );
  }
}

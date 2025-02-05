import { Injectable, Signal, signal } from '@angular/core';
import { CalendarState } from './calendar.models';
import { getDateHash } from './date.helper';

const DEFAUTL_CALENDRA_STATE: CalendarState = {
  dateParams: null,
}

@Injectable({
  providedIn: 'root',
})
export class CalendarStateService {
  private readonly state = signal<CalendarState>(DEFAUTL_CALENDRA_STATE);

  get(): CalendarState {
    return this.state();
  }

  signal(): Signal<CalendarState> {
    return this.state.asReadonly();
  }

  update<K extends keyof CalendarState>(key: K, data: CalendarState[K]) {
    this.state.update(state => ({ ...state, ...{ [key]: data } }));
  }

  select<T>(key: keyof CalendarState): T {
    return this.state()[key] as T;
  }

  getDateHash(): string {
    const params = this.get().dateParams;
    return params ? getDateHash(params) : 'today';
  }
}

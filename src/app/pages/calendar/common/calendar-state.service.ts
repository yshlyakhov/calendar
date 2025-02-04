import { Injectable, Signal, signal } from '@angular/core';
import { CalendarState } from './calendar.models';

const DEFAUTL_CALENDRA_STATE: CalendarState = {
  dateParams: null,
  appointments: [],
}

@Injectable()
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
}

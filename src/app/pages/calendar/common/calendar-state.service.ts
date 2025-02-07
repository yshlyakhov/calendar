import { Injectable, Signal, signal } from '@angular/core';
import { CalendarState } from './calendar.models';
import { getDateHash, getDateParams } from './date.helper';

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

  set(state: CalendarState): void {
    this.state.set(state);
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
    return params ? getDateHash(params) : getDateHash(getDateParams(new Date));
  }

  removeAppointmentById(id: string): void {
    const state = this.state();

    for (const key in state) {
      if (key !== 'dateParams') {
        const index = state[key]!.findIndex(item => item.id === id);
        if (index > -1) {
          state[key]?.splice(index, 1);
          return;
        }
      }
    }
  }
}

import { Params } from '@angular/router';
import { getAppointmentDate } from './date.helper';

export interface DateParams {
  year: number;
  month: number;
  day: number;
}

export const isDateParams = (object: Params): object is DateParams => {
  return Object.values(object).every((value) => !isNaN(value));
}

export interface CalendarDayPageData {
  dateParams: DateParams|null;
}

export interface AppointmentDate {
  date: Date|null;
  startTime: Date|null;
  endTime: Date|null;
}

export class Appointment implements AppointmentDate {
  id: string;
  title: string;
  date: Date|null;
  startTime: Date|null;
  endTime: Date|null;
  description: string;

  constructor(data?: AppointmentCreateData, { id, title, date, startTime, endTime, description }: Appointment = {
    id: Math.random().toString().slice(-6),
    title: '',
    date: null,
    startTime: null,
    endTime: null,
    description: ''
  }) {
    const appointmentDate = data ? getAppointmentDate(data.date, data.timeslot) :  getAppointmentDate();
    this.id = id;
    this.title = title;
    this.date = date || appointmentDate.date;
    this.startTime = startTime || appointmentDate.startTime;
    this.endTime = endTime || appointmentDate.endTime;
    this.description = description;
  }
}

export interface AppointmentCreateData {
  date: Date;
  timeslot?: number;
}

export enum AppointmentAction {
  CREATE,
  EDIT,
  DELETE,
}

export interface Data<T> {
  [key: string]: T[] | null;
}

export type CalendarState = Data<Appointment> & {
  dateParams: DateParams | null;
}

export interface TimeSlot {
  time: string;
}

export const DAY_SCHEDULE: TimeSlot[] = Array(24).fill(0).map((_, index)=> ({ time: `${index < 10 ? '0' + index : index}:00`}));

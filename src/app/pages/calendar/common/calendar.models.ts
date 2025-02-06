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
  data: Appointment[];
}

export interface AppointmentDate {
  date: Date;
  startTime: Date;
  endTime: Date;
}

export class Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  lastModified: number; // unique value for track fn

  constructor(data?: AppointmentCreateData) {
    const { date, startTime, endTime } = data ? getAppointmentDate(data.date, data.timeslot) :  getAppointmentDate(new Date());
    this.id = Math.random().toString().slice(-6);
    this.title = '';
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = '';
    this.lastModified = Date.now();
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

export const APPOINTMENT_CONFIG = {
  title: {
    maxLength: 50,
  },
  description: {
    maxLength: 250,
  }
}

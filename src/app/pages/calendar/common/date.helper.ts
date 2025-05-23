import { Appointment, AppointmentDate, DateParams } from './calendar.models';

export const lastDateOfMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;

export const coerceDate = ({ year, month, day }: DateParams): DateParams => {
  year = Math.max(1970, year);
  year = Math.min(year, 9999);
  month = Math.max(1, month);
  month = Math.min(month, 12);
  day = Math.max(1, day);
  day = Math.min(day, lastDateOfMonth(year, month));

  return { year, month, day };
}

export const getDate = ({ year, month, day }: DateParams): Date => {
  return new Date(year, month - 1, day);
}

export const getDateParams = (date: Date): DateParams => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
}

export const isTodayDate = (date: Date): boolean => {
  if (!date) {
    return false;
  }
  return new Date().setHours(0,0,0,0) === new Date(date).setHours(0,0,0,0);
}

export const getDateHash = ({ year, month, day }: DateParams): string => {
  return `${year}-${month}-${day}`;
}

export const getAppointmentDate = (date: Date, timeslot: number = -1): AppointmentDate => {
  date = new Date(date);
  date.setHours(0,0,0,0);
  const startTime = new Date(date);
  const endTime = new Date(date);
  const hoursOffset = Math.ceil((Date.now() - new Date().setHours(0,0,0,0)) / HOUR);
  // move date to the naxt day
  if (timeslot === -1 && hoursOffset === 24) {
    date.setDate(date.getDate() + 1);
  }
  startTime.setMinutes(timeslot >= 0 ? timeslot * 60 : hoursOffset * 60);
  endTime.setMinutes(timeslot >= 0 ? timeslot * 60 + 60 : hoursOffset * 60 + 60);
  return { date, startTime, endTime };
}

export const getMinutesOffset = (date: Date): number => {
  return (new Date(date).getTime() - new Date(date).setHours(0,0,0,0)) / MINUTE;
}

export const updateDateByMinutes = (date: Date, delta: number = 0): Date => {
  date = new Date(date);
  date.setMinutes(date.getMinutes() + delta, 0, 0)
  return date;
}

export const updateDateByTime = (date: Date, time: Date): Date => {
  date = new Date(date);
  time = new Date(time);
  date.setHours(time.getHours(), time.getMinutes());
  return date;
}

export const coerceAppointmentDate = ({ date, startTime, endTime }: Appointment): AppointmentDate => {
  return ({
    date: new Date(date),
    startTime: new Date(startTime),
    endTime: new Date(endTime,)
  });
}

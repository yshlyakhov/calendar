import { Routes } from '@angular/router';
import { RoutesConfig } from '@configs';
import { URL_SERVICE } from '@shared/services/url.service';
import { AppointmentService } from './appointment/common/appointment.service';
import { calendarDayGuard } from './calendar-day/common/calendar-day.guard';
import { calendarDayResolver } from './calendar-day/common/calendar-day.resolver';
import { CalendarUrlService } from './common/calendar-url.service';
import { dayTitleResolver } from './common/day-title.resolver';

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./calendar.component').then(component => component.CalendarComponent),
    providers: [
      CalendarUrlService,
      {
        provide: URL_SERVICE,
        useExisting: CalendarUrlService,
      },
    ],
    children: [
      {
        path: '',
        redirectTo: RoutesConfig.calendar.today,
        pathMatch: 'full',
      },
      {
        path: RoutesConfig.calendar.today,
        title: 'today',
        loadComponent: () => import('./calendar-day/calendar-day.component').then(component => component.CalendarDayComponent),
        resolve: {
          pageData: calendarDayResolver,
        },
      },
      {
        path: RoutesConfig.calendar.day,
        title: dayTitleResolver,
        loadComponent: () => import('./calendar-day/calendar-day.component').then(component => component.CalendarDayComponent),
        canActivate: [calendarDayGuard],
        resolve: {
          pageData: calendarDayResolver,
        },
      },

    ],
  }
];

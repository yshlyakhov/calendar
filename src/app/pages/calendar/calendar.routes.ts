import { Routes } from '@angular/router';
import { RoutesConfig } from '@configs';
import { calendarDayGuard } from './common/calendar-day.guard';
import { calendarDayResolver } from './common/calendar-day.resolver';
import { CalendarUrlService } from './common/calendar-url.service';
import { URL_SERVICE } from '@shared/services/url.service';
import { CalendarPageDataService } from './common/calendar-day-page-data.service';

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
      CalendarPageDataService,
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
        title: 'day',
        loadComponent: () => import('./calendar-day/calendar-day.component').then(component => component.CalendarDayComponent),
        canActivate: [calendarDayGuard],
        resolve: {
          pageData: calendarDayResolver,
        },
      },

    ],
  }
];

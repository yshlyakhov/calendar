import { Routes } from '@angular/router';
import { RoutesConfig } from '@configs';

export const routes: Routes = [
  {
    path: RoutesConfig.general.root,
    redirectTo: RoutesConfig.calendar.calendar,
    pathMatch: 'full',
  },
  {
    path: RoutesConfig.calendar.calendar,
    title: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.routes').then(routes => routes.CALENDAR_ROUTES),
  },
  {
    path: RoutesConfig.general.notFound,
    title: 'not found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(component => component.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: RoutesConfig.general.notFound,
  }
];

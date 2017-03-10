import { Route } from '@angular/router';
import { AlertsComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const AlertsRoutes: Route[] = [
  {
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [LoggedInGuard]
  }
];

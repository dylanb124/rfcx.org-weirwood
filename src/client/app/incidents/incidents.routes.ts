import { Route } from '@angular/router';
import { IncidentsComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const IncidentsRoutes: Route[] = [
  {
    path: 'incidents',
    component: IncidentsComponent,
    canActivate: [LoggedInGuard]
  }
];

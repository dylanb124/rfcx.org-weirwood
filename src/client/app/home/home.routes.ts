import { Route } from '@angular/router';
import { HomeComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const HomeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [LoggedInGuard]
  }
];

import { Route } from '@angular/router';
import { LoginComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const LoginRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard]
  }
];

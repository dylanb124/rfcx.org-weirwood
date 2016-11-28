import { Route } from '@angular/router';
import { AboutComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const AboutRoutes: Route[] = [
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [LoggedInGuard]
  }
];

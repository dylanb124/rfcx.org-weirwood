import { Route } from '@angular/router';
import { StyleguideComponent } from './index';

import { LoggedInGuard } from '../shared/user/logged-in.guard';

export const StyleguideRoutes: Route[] = [
  {
    path: 'styleguide',
    component: StyleguideComponent
  }
];

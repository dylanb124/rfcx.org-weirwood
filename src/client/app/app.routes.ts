import { Routes } from '@angular/router';

import { StyleguideRoutes } from './styleguide/index';
import { LoginRoutes } from './login/index';
import { HomeRoutes } from './home/index';

export const routes: Routes = [
  ...StyleguideRoutes,
  ...LoginRoutes,
  ...HomeRoutes,
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';

import { LoginRoutes } from './login/index';
import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';

export const routes: Routes = [
  ...LoginRoutes,
  ...HomeRoutes,
  ...AboutRoutes,
  { path: '**', redirectTo: '' }
];

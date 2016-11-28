import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(
        private router: Router,
        private user: UserService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.user.isLoggedIn() && state.url !== '/login') {
            this.router.navigate(['/login']);
            return false;
        }
        // if user is logged in, but wants to open login page manually, then redirect to home
        if (this.user.isLoggedIn() && state.url === '/login') {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
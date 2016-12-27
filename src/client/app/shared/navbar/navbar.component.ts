import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../user/user.service';
import { APP_CONFIG, IAppConfig } from '../../app.config';

let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent {

    constructor(
        private userService: UserService,
        private router: Router,
        @Inject(APP_CONFIG) private config: IAppConfig
    ) {
        console.log('app configggg', this.config);
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (jQuery(window).width() <= (this.config.dimensions.phone.max || 767)) {
                    window.scrollTo(0,0);
                }
            }
        });
    }

    logOut() {
        this.userService.logOut();
    }

    isRouteActive(route: string): boolean {
        return this.router.isActive(route, true);
    }

}

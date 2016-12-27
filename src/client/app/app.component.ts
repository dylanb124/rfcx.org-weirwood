import { Component, Inject } from '@angular/core';
import { Config } from './shared/index';
import { UserService } from './shared/user/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { APP_CONFIG, IAppConfig } from './app.config';
import './operators';

let jQuery: any = (window as any)['$'];

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'rfcx-org',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
  constructor(
    private user: UserService,
    private router: Router,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    console.log('Environment config', Config);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (jQuery(window).width() <= (this.config.dimensions.phone.max || 767)) {
            window.scrollTo(0,0);
        }
      }
    });
  }

  isLoggedIn() {
      return this.user.isLoggedIn();
  }
}

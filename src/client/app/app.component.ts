import { Component } from '@angular/core';
import { Config } from './shared/index';
import { UserService } from './shared/user/user.service';

import './operators';

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
  constructor(private user: UserService) {
    console.log('Environment config', Config);
  }

  isLoggedIn() {
      return this.user.isLoggedIn();
  }
}

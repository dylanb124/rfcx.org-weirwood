import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/index';
import { FooterComponent } from './footer/index';
import { SpinnerComponent } from './spinner/index';
import { DropdownComponent } from './dropdown/index';
import { DropdownCheckboxesComponent } from './dropdown-checkboxes/index';
import { RfcxMapComponent, RfcxBaseMapComponent, RfcxMapMarkerComponent,
         RfcxMapPieComponent, RfcxMapSiteBoundComponent } from './rfcx-map/index';
import { DateTimePickerComponent } from './date-time-picker/index';
import { RfcxStreamerComponent } from './rfcx-streamer/index';
import { UserService } from './user/user.service';
import { AudioService, GuardianService, SiteService } from './services/index';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AudioNotifier } from './audio-notifier/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    SpinnerComponent,
    DropdownComponent,
    DropdownCheckboxesComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent,
    RfcxMapMarkerComponent,
    RfcxMapPieComponent,
    RfcxMapSiteBoundComponent,
    DateTimePickerComponent,
    RfcxStreamerComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    SpinnerComponent,
    DropdownComponent,
    DropdownCheckboxesComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent,
    RfcxMapMarkerComponent,
    RfcxMapPieComponent,
    RfcxMapSiteBoundComponent,
    DateTimePickerComponent,
    RfcxStreamerComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        UserService,
        CookieService,
        SiteService,
        AudioService,
        GuardianService,
        AudioNotifier
      ]
    };
  }
}

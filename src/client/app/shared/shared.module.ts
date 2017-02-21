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
import { RfcxMapComponent, RfcxBaseMapComponent, RfcxMapMarkerComponent, RfcxMapPieComponent } from './rfcx-map/index';
import { DateTimePickerComponent } from './date-time-picker/index';
import { UserService } from './user/user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

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
    DateTimePickerComponent
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
    DateTimePickerComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        UserService,
        CookieService
      ]
    };
  }
}

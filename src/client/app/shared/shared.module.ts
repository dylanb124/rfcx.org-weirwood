import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/index';
import { SpinnerComponent } from './spinner/index';
import { DropdownComponent } from './dropdown/index';
import { DropdownCheckboxesComponent } from './dropdown-checkboxes/index';
import { RfcxMapComponent, RfcxBaseMapComponent } from './rfcx-map/index';
import { DateTimePickerComponent } from './date-time-picker/index';
import { DateTimePickerIncidentsComponent } from './date-time-picker-incidents/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    NavbarComponent,
    SpinnerComponent,
    DropdownComponent,
    DropdownCheckboxesComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent,
    DateTimePickerComponent,
    DateTimePickerIncidentsComponent
  ],
  exports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    SpinnerComponent,
    DropdownComponent,
    DropdownCheckboxesComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent,
    DateTimePickerComponent,
    DateTimePickerIncidentsComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}

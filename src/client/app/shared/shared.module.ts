import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/index';
import { SpinnerComponent } from './spinner/index';
import { DropdownComponent } from './dropdown/index';
import { RfcxMapComponent, RfcxBaseMapComponent } from './rfcx-map/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    NavbarComponent,
    SpinnerComponent,
    DropdownComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent
  ],
  exports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    SpinnerComponent,
    DropdownComponent,
    RfcxMapComponent,
    RfcxBaseMapComponent
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

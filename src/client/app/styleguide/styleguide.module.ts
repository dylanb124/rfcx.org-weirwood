import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StyleguideComponent } from './styleguide.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [StyleguideComponent],
  exports: [StyleguideComponent],
  providers: []
})
export class StyleguideModule { }

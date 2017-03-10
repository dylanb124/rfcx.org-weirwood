import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AlertsComponent } from './alerts.component';
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AlertsComponent],
  exports: [AlertsComponent],
  providers: []
})
export class AlertsModule { }

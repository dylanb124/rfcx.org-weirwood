import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { IncidentsComponent } from './incidents.component';
import { IncidentsChartComponent } from './chart/chart.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [IncidentsComponent, IncidentsChartComponent],
  exports: [IncidentsComponent],
  providers: []
})
export class IncidentsModule { }

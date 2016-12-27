import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { IncidentsComponent } from './incidents.component';
import { IncidentsChartComponent } from './chart/chart.component';
import { IncidentsTableComponent } from './table/table.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [IncidentsComponent, IncidentsChartComponent, IncidentsTableComponent],
  exports: [IncidentsComponent],
  providers: []
})
export class IncidentsModule { }

import { Component } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';

import * as moment from 'moment';

/**
 * This class represents the lazy loaded IncidentsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-incidents',
  templateUrl: 'incidents.component.html',
  styleUrls: ['incidents.component.css'],
})

export class IncidentsComponent {

  private rfcxMap: any;
  private mapDetails: any = {
    lat: 37.773972,
    lon: -122.431297,
    zoom: 13
  }
  private today: Date;
  private maxDate: Date;
  private currentDaysCount: DropdownItem;

  public incidents: Array<DropdownCheckboxItem> = [
      { value: 'vehicles', label: 'Vehicles', checked: false },
      { value: 'shots', label: 'Shots', checked: false },
      { value: 'chainsaws', label: 'Chainsaws', checked: false }
    ];

  public daysCount: Array<DropdownItem> = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 5, label: '5 Days' },
    { value: 7, label: '7 Days' }
  ];

  constructor() {}

  recalculateDates() {
    if (this.currentDaysCount.value > 1) {
      this.maxDate = moment(this.today).subtract(this.currentDaysCount.value, 'days').toDate();
    }
    else {
      this.maxDate = new Date();
    }
  }

  incidentsTypeChanged(event: any) {
    console.log('incidentsTypeChanged', event);
  }

  daysCountChanged(event: any) {
    this.currentDaysCount = event.item;
    this.recalculateDates();
  }

  dateChanged(event: any) {
    console.log('dateChanged', event);
  }
}

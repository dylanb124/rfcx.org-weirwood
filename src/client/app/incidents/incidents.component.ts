import { Component } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';

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
  private maxDate: Date = new Date();
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

  incidentsTypeChanged(event: any) {
    console.log('incidentsTypeChanged', event);
  }

  daysCountChanged(event: any) {
    this.currentDaysCount = event.item;
    console.log('daysCountChanged', event);
  }

  dateChanged(event: any) {
    console.log('dateChanged', event);
  }
}

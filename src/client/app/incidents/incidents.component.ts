import { Component } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';

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

  public incidents: Array<DropdownItem> = [
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'shots', label: 'Shots' },
      { value: 'chainsaws', label: 'Chainsaws' }
    ];

  constructor() {}

  incidentsTypeChanged(event: any) {
    console.log('incidentsTypeChanged', event);
  }

}

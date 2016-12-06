import { Component } from '@angular/core';

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

  constructor() {}

}

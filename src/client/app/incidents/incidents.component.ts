import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';

import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'sd-incidents',
  templateUrl: 'incidents.component.html',
  styleUrls: ['incidents.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class IncidentsComponent implements OnInit {

  public incidentsColors = {
    vehicles: 'rgba(34, 176, 163, 0.8)',
    shots: 'rgba(240, 65, 84, 0.8)',
    chainsaws: 'rgba(245, 166, 35, 0.8)'
  };

  public incidentTypes: Array<DropdownCheckboxItem> = [
    { value: 'vehicles', label: 'Vehicles', checked: false },
    { value: 'shots', label: 'Shots', checked: false },
    { value: 'chainsaws', label: 'Chainsaws', checked: false }
  ];

  public daysCount: Array<DropdownItem> = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 5, label: '5 Days' },
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' }
  ];

  public formats: Array<DropdownItem> = [
      { value: 'SAV', label: 'SPSS.SAV' },
      { value: 'PDF', label: 'Adobe.PDF' },
      { value: 'ODT', label: 'OpenOffice.ODT' },
      { value: 'XSLX', label: 'Microsoft.XSLX' },
      { value: 'Microsoft.DOCX', label: 'Microsoft.DOCX' },
      { value: 'CSV', label: 'Comma-separated.CSV' }
    ];

  // tslint:disable-next-line:no-unused-variable
  private mapDetails: any = {
    lat: 37.773972,
    lon: -122.431297,
    zoom: 13
  };
  private minCircleDiameter: number = 80;
  private maxCircleDiameter: number = 150;
  private incidents: Array<any>;
  private today: Date;
  private maxDate: Date;
  private currentDaysCount: DropdownItem;
  private mobileFiltersOpened: boolean = false;

  ngOnInit() {
    this.getData()
      .then((data: Array<any>) => {
        this.incidents = data;
      })
      .then(this.countIncidents.bind(this))
      .then(this.calculateDiameters.bind(this))
      .catch((err) => console.log('err', err));
  }

  getData() {
    return new Promise((resolve, reject) => {
      resolve([
        {
            coords: {
                lat: this.mapDetails.lat,
                lon: this.mapDetails.lon
            },
            events: [
                {count: 70, label: 'vehicles'},
                {count: 19, label: 'shots'},
                {count: 40, label: 'chainsaws'}
            ]
        },
        {
            coords: {
                lat: this.mapDetails.lat - 0.015,
                lon: this.mapDetails.lon + 0.03
            },
            events: [
                {count: 1, label: 'vehicles'},
                {count: 30, label: 'shots'},
                {count: 10, label: 'chainsaws'}
            ]
        },
        {
            coords: {
                lat: this.mapDetails.lat - 0.009,
                lon: this.mapDetails.lon - 0.022
            },
            events: [
                {count: 10, label: 'vehicles'},
                {count: 50, label: 'shots'},
                {count: 3, label: 'chainsaws'}
            ]
        },
        {
            coords: {
                lat: this.mapDetails.lat,
                lon: this.mapDetails.lon - 0.041
            },
            events: [
                {count: 1, label: 'vehicles'},
                {count: 2, label: 'shots'},
                {count: 13, label: 'chainsaws'}
            ]
        }
      ]);
    });
  }

  countIncidents() {
    return new Promise((resolve, reject) => {
        try {
            this.incidents.forEach((item) => {
                let count = 0;
                item.events.forEach((incident: any) => {
                    count += incident.count;
                });
                item.eventsCount = count;
            });
            resolve();
        }
        catch(e) {
            reject(e);
        }
    });
  }

  calculateDiameters(arr: Array<any>) {
    return new Promise((resolve, reject) => {
        try {
            let deltaPx = this.maxCircleDiameter - this.minCircleDiameter;
            let diameters = this.incidents.map((item) => {
                return item.eventsCount;
            });
            let min = Math.min.apply(null, diameters);
            let max = Math.max.apply(null, diameters);
            let deltaInc = max - min;
            this.incidents.forEach((item) => {
                if (item.eventsCount === min) {
                    item.diameter = this.minCircleDiameter;
                }
                else if (item.eventsCount === max) {
                    item.diameter = this.maxCircleDiameter;
                }
                else {
                    let coef = item.eventsCount/deltaInc;
                    item.diameter = this.minCircleDiameter + Math.round(deltaPx * coef);
                }
            });
            resolve();
        }
        catch(e) {
            reject(e);
        }
    });
  }

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

  toggleMobileFilters() {
    this.mobileFiltersOpened = !this.mobileFiltersOpened;
  }

  formatChanged(event:any) {
      console.log('formatChanged', event);
  }
}

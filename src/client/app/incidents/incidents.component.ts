import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CookieService }  from 'angular2-cookie/core';
import { Config } from '../shared/config/env.config.js';

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
    { value: 'vehicles', label: 'Vehicles', checked: true },
    { value: 'shots', label: 'Shots', checked: true },
    { value: 'chainsaws', label: 'Chainsaws', checked: true }
  ];

  public daysCount: Array<DropdownItem> = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 5, label: '5 Days', selected: true },
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
    zoom: 10,
    // minZoom: 12
  };
  private minCircleDiameter: number = 80;
  private maxCircleDiameter: number = 150;
  private incidents: Array<any>;
  private today: Date;
  private maxDate: Date;
  private currentDaysCount: DropdownItem;
  private mobileFiltersOpened: boolean = false;

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) {}

  ngOnInit() {
      // set to 5 days by default
      this.currentDaysCount = this.daysCount.filter((item) => {
          return item.value === 5;
      })[0];
      this.recalculateDates();
      this.initialDataLoad();
  }

  initialDataLoad() {
      this.getData()
        .subscribe((res:any) => {
            this.incidents = res.json();
            this.getInitialMapCenter();
            this.countIncidents();
            this.calculateDiameters();
        });
  }

  getData() {
    let headers = new Headers({
        'Content-Type': 'application/json',
        'x-auth-user': 'user/' + this.cookieService.get('guid'),
        'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({ headers: headers });

    let request = this.http
        .get(
            Config.API + 'events/stats/guardian',
            options
        );
    return request;
  }

  getInitialMapCenter() {
      this.mapDetails.lat = this.incidents.length? this.incidents[0].coords.lat : 37.773972;
      this.mapDetails.lon = this.incidents.length? this.incidents[0].coords.lon : -122.431297;
  }

  countIncidents() {
    this.incidents.forEach((item) => {
        let count = 0;
        for (let key in item.events) {
            count += item.events[key];
        }
        item.eventsCount = count;
    });
  }

  calculateDiameters() {
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

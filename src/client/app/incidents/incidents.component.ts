import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
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
    { value: 'vehicle', label: 'Vehicles', checked: true },
    { value: 'shot', label: 'Shots', checked: true },
    { value: 'chainsaw', label: 'Chainsaws', checked: true }
  ];

  public daysCount: Array<DropdownItem> = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 5, label: '5 Days', selected: true },
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' }
  ];

  public formats: Array<DropdownItem> = [
      { value: 'csv_dates', label: 'csv grouped by dates' },
      { value: 'csv_guardians', label: 'csv grouped by guardians' }
    ];

  public colors: any = {
        vehicle: 'rgba(34, 176, 163, 1)',
        shot: 'rgba(240, 65, 84, 1)',
        chainsaw: 'rgba(245, 166, 35, 1)'
    };

  // tslint:disable-next-line:no-unused-variable
  private mapDetails: any = {
    zoom: 10
  };
  private minCircleDiameter: number = 80;
  private maxCircleDiameter: number = 150;
  private incidents: Array<any>;
  private incidentsByYear: any;
  private incidentsByDates: Array<any>;
  private today: Date;
  private maxDate: Date;
  private currentDate: Date;
  private currentDaysCount: number = 5;
  private currentdateStartingAfter: string;
  private currentdateEndingBefore: string;
  private currentIncidentTypeValues: Array<string>;
  private mobileFiltersOpened: boolean = false;
  private isLoading: boolean = false;

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) {}

  ngOnInit() {
      this.intializeFilterValues();
      this.loadData();
  }

  intializeFilterValues() {
      this.currentDate = moment(this.maxDate).subtract(this.currentDaysCount, 'days').toDate();
      this.recalculateDates();
      this.refreshTimeBounds();
      this.currentIncidentTypeValues = this.getCheckedIncidentTypeValues();
  }

  getCheckedIncidentTypeValues(incidentTypes?: Array<DropdownCheckboxItem>) {
      incidentTypes = incidentTypes || this.incidentTypes;
      let arr: Array<string> = [];
      incidentTypes.forEach((item) => {
          if (item.checked) {
              arr.push(item.value);
          }
      });
      return arr;
  }

  loadData() {
      this.isLoading = true;
      let opts:any = {
          starting_after: this.currentdateStartingAfter,
          ending_before: this.currentdateEndingBefore,
          values: this.currentIncidentTypeValues
      };
      this.getDataByGuardians(opts)
          .subscribe((res:any) => {
              this.incidents = this.parseIncidentsByGuardians(res.json());
              this.isLoading = false;
              console.log('incidents by guardians', this.incidents);
              this.getInitialMapCenter();
              this.countIncidents();
              this.calculateDiameters();
          });

      this.getDataByDates(opts)
          .subscribe((res:any) => {
              this.incidentsByDates = this.parseIncidentsByDates(res.json());
              console.log('incidents by dates', this.incidentsByDates);
          });

      this.getDataByDates({ url: 'events/stats/year', values: this.currentIncidentTypeValues})
          .subscribe((res:any) => {
              this.incidentsByYear = this.parseIncidentsByYear(res.json());
              console.log('incidents by year', this.incidentsByYear);
          });
  }

  getDataByGuardians(opts: any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('starting_after', opts.starting_after);
    params.set('ending_before', opts.ending_before);
    opts.values.forEach((value: string) => {
        params.append('values', value);
    });

    let headers = new Headers({
        'Content-Type': 'application/json',
        'x-auth-user': 'user/' + this.cookieService.get('guid'),
        'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
        headers: headers,
        search: params
     });

    let request = this.http
        .get(
            Config.API + 'events/stats/guardian',
            options
        );
    return request;
  }

  getDataByDates(opts: any) {
    let params: URLSearchParams = new URLSearchParams();
    if (opts.starting_after) {
        params.set('starting_after', opts.starting_after);
    }
    if (opts.ending_before) {
        params.set('ending_before', opts.ending_before);
    }
    opts.values.forEach((value: string) => {
        params.append('values', value);
    });

    let headers = new Headers({
        'Content-Type': 'application/json',
        'x-auth-user': 'user/' + this.cookieService.get('guid'),
        'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
        headers: headers,
        search: params
    });

    let request = this.http
        .get(
            Config.API + (opts.url || 'events/stats/dates'),
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
    if (this.currentDaysCount > 1) {
      this.maxDate = moment(this.today).subtract(this.currentDaysCount, 'days').toDate();
    }
    else {
      this.maxDate = new Date();
    }
  }

  refreshTimeBounds() {
      this.currentdateStartingAfter = moment(this.currentDate).format('YYYY-MM-DD HH:mm:ss');
      this.currentdateEndingBefore = moment(this.currentDate).add(this.currentDaysCount, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  parseIncidentsByGuardians(incidents: Array<any>) {
      incidents.forEach((item) => {
          this.currentIncidentTypeValues.forEach((value) => {
              item.events[value] = item.events[value] || 0;
          });
      });
      return incidents;
  };

  parseIncidentsByDates(incidentsObj: any) {
      if (!Object.keys(incidentsObj).length) {
          return [];
      }
      let datesArr: Array<any> = [];
      for (let i = 0; i < this.currentDaysCount; i++) {
          let date = moment(this.currentDate).add(i, 'days');
          let dateStr = date.format('M/D/YYYY');
          let obj:any = {
              date: date.toDate(),
              events: {}
          };
          this.currentIncidentTypeValues.forEach((item) => {
              let actualValue = 0;
              if (item && incidentsObj[dateStr] && incidentsObj[dateStr][item]) {
                  actualValue = incidentsObj[dateStr][item];
              }
              obj.events[item] = actualValue;
          });
          datesArr.push(obj);
      }
      return datesArr;
  }

  parseIncidentsByYear(incidentsObj: any) {
      if (!Object.keys(incidentsObj).length) {
        return null;
      }
      let datesObj: any = {},
          today = moment();
      for (var m = moment().subtract(1, 'year'); m.diff(today, 'days') <= 0; m.add(1, 'days')) {
        datesObj[m.format('M/D/YYYY')] = false;
      };
      for (let key in incidentsObj) {
        datesObj[key] = !!Object.keys(incidentsObj[key]).length;
      }
      return datesObj;
  }

  incidentsTypeChanged(event: any) {
    this.currentIncidentTypeValues = this.getCheckedIncidentTypeValues(event.items);
    if (this.currentIncidentTypeValues.length) {
        this.loadData();
    }
    else {
        this.incidents = [];
        this.incidentsByDates = [];
    }
  }

  daysCountChanged(event: any) {
    this.currentDaysCount = event.item.value;
    this.recalculateDates();
    this.refreshTimeBounds();
  }

  dateChanged(event: any) {
    console.log('dateChanged', event);
    this.currentDate = event.date;
    this.refreshTimeBounds();
    this.loadData();
  }

  toggleMobileFilters() {
    this.mobileFiltersOpened = !this.mobileFiltersOpened;
  }

  generateCSV(type: string): string {
      if (['csv_guardians', 'csv_dates'].indexOf(type) === -1) {
          return null;
      }
      let csv = '',
          arr;
      // both values sets represent array of items with equal object attribute 'events', but different labels: 'shortname' and 'date'
      // make an array with similar objects
      switch (type) {
          case 'csv_guardians':
              // for these incidents label will be shortname
              arr = this.incidents.map((item) => {
                  item.label = item.shortname;
                  return item;
              });
              csv += 'guardian,';
              break;
          case 'csv_dates':
              // for these incidents label will be date with special format
              arr = this.incidentsByDates.map((item) => {
                  item.label = moment(item.date).format('M/D/YYYY');
                  return item;
              });
              csv += 'date,';
              break;
      }
      // combine all type labels in one string for csv header row
      csv += this.currentIncidentTypeValues.join(',') + '\n';
      arr.forEach((item) => {
          csv += item.label + ',';
          // combine all type values in one string
          let values = this.currentIncidentTypeValues.map((value) => {
              return item.events[value];
          });
          csv += values.join(',') + '\n';
      });
      return csv;
  }

  combineCSVFileName(type: string) {
      let name = 'incidents_';
      name += type;
      name += '_';
      name += moment(this.currentdateStartingAfter).format('M/D/YYYY');
      name += '_';
      name += moment(this.currentdateEndingBefore).format('M/D/YYYY');
      name += '.csv';
      return name;
  }

  formatChanged(event:any) {
      let type = event.item.value;
      let csv = this.generateCSV(type);
      if (!csv) {
          return;
      }
      let blob = new Blob([csv], {'type':'application\/octet-stream'});
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = this.combineCSVFileName(type);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      a = null;
  }
}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
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

  public sitesList: Array<DropdownCheckboxItem> = [];

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

  public mapDetails: any = {
    zoom: 10
  };
  public minCircleDiameter: number = 80;
  public maxCircleDiameter: number = 150;
  public incidents: Array<any>;
  public incidentsByYear: any;
  public incidentsByDates: Array<any>;
  public maxDate: Date = new Date();
  public currentDate: Date;
  public currentDaysCount: number = 5;
  public currentdateStartingAfter: string;
  public currentdateEndingBefore: string;
  public currentIncidentTypeValues: Array<string>;
  public currentSiteValues: Array<string>;
  public mobileFiltersOpened: boolean = false;
  public isLoading: boolean = false;

  constructor(
    public http: Http,
    public cookieService: CookieService,
  ) { }

  ngOnInit() {
    // start loading initial data only after loading all sites
    this.intializeFilterValues(() => {
      this.loadData({ initial: true });
    });
  }

  intializeFilterValues(cb: Function) {
    this.currentDate = moment(this.maxDate).subtract(this.currentDaysCount, 'days').toDate();
    this.recalculateDates();
    this.refreshTimeBounds();
    this.currentIncidentTypeValues = this.getCheckedDropdownCheckboxItems(this.incidentTypes);
    this.initSitesFilter(cb);
  }

  loadData(opts?: any) {
    this.isLoading = true;
    let observArr = [
      this.getDataByGuardians(),
      this.getDataByDates({
        starting_after: this.currentdateStartingAfter,
        ending_before: this.currentdateEndingBefore,
        values: this.currentIncidentTypeValues,
        sites: this.currentSiteValues
      })
    ];
    if (opts && opts.initial) {
      observArr.push(
        this.getDataByDates({
          url: 'events/stats/year',
          values: this.currentIncidentTypeValues
        })
      );
    }
    Observable
      .forkJoin(observArr)
      .subscribe(
        data => {
          this.isLoading = false;
          this.onDataByGuardians(data[0]);
          this.onDataByDates(data[1]);
          if (opts && opts.initial) {
            this.onDataByYears(data[2]);
            this.checkInitialLoadedData();
          }
        },
        err => console.log('Error loading incidents', err)
      );
  }

  getCheckedDropdownCheckboxItems(items: Array<DropdownCheckboxItem>) {
    let arr: Array<string> = [];
    items.forEach((item) => {
      if (item.checked) {
        arr.push(item.value);
      }
    });
    return arr;
  }

  initSitesFilter(cb: Function) {
    let observ = this.getSites();
    observ.subscribe(
      data => {
        if (data && data.length) {
          this.sitesList = data.map((item: any) => {
            return {
              label: item.name,
              value: item.guid,
              checked: true
            }
          });
        }
        this.currentSiteValues = this.getCheckedDropdownCheckboxItems(this.sitesList);
        cb();
      },
      err => console.log('Error loading sites', err)
    )
    return observ;
  }

  getSites() {
    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.get(Config.API + 'sites', options)
                    .map((res) => res.json())
                    .share();
  }

  getDataByGuardians() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('starting_after', this.currentdateStartingAfter);
    params.set('ending_before', this.currentdateEndingBefore);
    this.currentIncidentTypeValues.forEach((value: string) => {
      params.append('values', value);
    });
    this.currentSiteValues.forEach((value: string) => {
      params.append('sites[]', value);
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

    return this.http.get(Config.API + 'events/stats/guardian', options)
                    .map((res) => res.json());
  }

  onDataByGuardians(data: any) {
    this.incidents = this.parseIncidentsByGuardians(data);
    console.log('incidents by guardians', this.incidents);
    this.getInitialMapCenter();
    this.countIncidents();
    this.calculateDiameters();
  }

  getDataByDates(opts: any) {
    let params: URLSearchParams = new URLSearchParams();
    if (opts.starting_after) {
      params.set('starting_after', opts.starting_after);
    }
    if (opts.ending_before) {
      params.set('ending_before', opts.ending_before);
    }
    if (opts.values) {
      opts.values.forEach((value: string) => {
        params.append('values', value);
      });
    }
    if (opts.sites) {
      opts.sites.forEach((value: string) => {
        params.append('sites[]', value);
      });
    }

    let headers = new Headers({
      'Content-Type': 'application/json',
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers,
      search: params
    });

    return this.http.get(Config.API + (opts.url || 'events/stats/dates'), options)
                    .map((res) => res.json());
  }

  onDataByDates(data: any) {
    this.incidentsByDates = this.parseIncidentsByDates(data);
    console.log('incidents by dates', this.incidentsByDates);
  }

  onDataByYears(data: any) {
    this.incidentsByYear = this.parseIncidentsByYear(data);
    console.log('incidents by year', this.incidentsByYear);
  }

  getInitialMapCenter() {
    this.mapDetails.lat = this.incidents && this.incidents.length ? this.incidents[0].coords.lat : 37.773972;
    this.mapDetails.lon = this.incidents && this.incidents.length ? this.incidents[0].coords.lon : -122.431297;
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
    let eventCounts = this.incidents.map((item) => {
      return item.eventsCount;
    });
    let min = Math.min.apply(null, eventCounts);
    let max = Math.max.apply(null, eventCounts);
    let deltaInc = max - min;
    this.incidents.forEach((item) => {
      if (item.eventsCount === min) {
        item.diameter = this.minCircleDiameter;
      }
      else if (item.eventsCount === max) {
        item.diameter = this.maxCircleDiameter;
      }
      else {
        let coef = item.eventsCount / deltaInc;
        item.diameter = this.minCircleDiameter + Math.round(deltaPx * coef);
      }
    });
  }

  recalculateDates() {
    if (this.currentDaysCount > 1) {
      this.maxDate = moment().subtract(this.currentDaysCount, 'days').toDate();
    }
    else {
      this.maxDate = new Date();
    }
  }

  refreshTimeBounds() {
    this.currentdateStartingAfter = moment(this.currentDate).format('YYYY-MM-DD 00:00:00');
    this.currentdateEndingBefore = moment(this.currentDate).add(this.currentDaysCount, 'days').format('YYYY-MM-DD 00:00:00');
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
      let dateStr = date.format('MM/DD/YYYY');
      let obj: any = {
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
      datesObj[m.format('MM/DD/YYYY')] = false;
    };
    for (let key in incidentsObj) {
      let item = incidentsObj[key];
      // ignore redundant incident values
      for (let value in item) {
        if (this.currentIncidentTypeValues.indexOf(value) === -1) {
          delete item[value];
        }
      }
      datesObj[key] = !!Object.keys(incidentsObj[key]).length;
    }
    return datesObj;
  }

  checkInitialLoadedData() {
    if (!this.incidentsByDates.length) {
      console.log('Incidents for this range not found. Searching for latest ones.');
      let date = this.findNearestDateInPast();
      if (!!date) {
        console.log('Latest incidents were on', moment(date).format('MMMM Do YYYY'));
        this.currentDate = date;
        this.refreshTimeBounds();
        this.loadData();
      }
    }
  }

  findNearestDateInPast(): Date {
    if (!this.incidentsByYear || !Object.keys(this.incidentsByYear).length) {
      return null;
    }
    let closestDate: any = null;
    for (let dateStr in this.incidentsByYear) {
      // boolean value
      let item = this.incidentsByYear[dateStr];
      // if date has incidents
      if (item) {
        let itemDate = new Date(dateStr);
        // if this date is in the past
        if (itemDate < new Date() && itemDate > closestDate) {
          closestDate = itemDate;
        }
      }
    }
    return closestDate;
  }

  siteChanged(event: any) {
    this.currentSiteValues = this.getCheckedDropdownCheckboxItems(event.items);
    if (this.currentSiteValues.length) {
      this.loadData();
    }
    else {
      this.incidents = [];
      this.incidentsByDates = [];
    }
  }

  incidentsTypeChanged(event: any) {
    this.currentIncidentTypeValues = this.getCheckedDropdownCheckboxItems(event.items);
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
      arr: any;
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
          item.label = moment(item.date).format('MM/DD/YYYY');
          return item;
        });
        csv += 'date,';
        break;
    }
    // combine all type labels in one string for csv header row
    csv += this.currentIncidentTypeValues.join(',') + '\n';
    arr.forEach((item: any) => {
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
    name += moment(this.currentdateStartingAfter).format('MM/DD/YYYY');
    name += '_';
    name += moment(this.currentdateEndingBefore).format('MM/DD/YYYY');
    name += '.csv';
    return name;
  }

  formatChanged(event: any) {
    let type = event.item.value;
    let csv = this.generateCSV(type);
    if (!csv) {
      return;
    }
    let blob = new Blob([csv], { 'type': 'application\/octet-stream' });
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = this.combineCSVFileName(type);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a = null;
  }
}

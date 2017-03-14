import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { SiteService } from '../shared/index';
import { Config } from '../shared/config/env.config.js';

import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'sd-alerts',
  templateUrl: 'alerts.component.html',
  styleUrls: ['alerts.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AlertsComponent implements OnInit {

  public sitesList: Array<DropdownCheckboxItem> = [];

  public incidentTypes: Array<DropdownCheckboxItem> = [
    { value: 'vehicle', label: 'Vehicles', checked: true },
    { value: 'shot', label: 'Shots', checked: true },
    { value: 'chainsaw', label: 'Chainsaws', checked: true }
  ];

  public mapDetails: any = {
    lat: 37.773972,
    lon: -122.431297,
    zoom: 10,
    maxZoom: 17
  };

  public incidents: Array<any> = [];
  public mapIncidents: Array<any> = [];
  public currentIncidentTypeValues: Array<string>;
  public currentSiteValues: Array<string>;
  public mobileFiltersOpened: boolean = false;
  public isLoading: boolean = false;
  // check request will be sent every intervalSec seconds
  public intervalSec: number = 30;
  public latestSyncTime: any = moment().subtract(this.intervalSec, 'seconds');
  public audio: any;

  constructor(
    public http: Http,
    public cookieService: CookieService,
    public siteService: SiteService
  ) { }

  ngOnInit() {
    // start loading initial data only after loading all sites
    this.initAudio();
    this.intializeFilterValues(() => {
      this.loadData();
      this.startCleaner();
    });
  }

  initAudio() {
    this.audio = new Audio();
    this.audio.src = '/assets/mp3/alert.mp3';
    this.audio.load();
  }

  intializeFilterValues(cb: Function) {
    this.currentIncidentTypeValues = this.getCheckedDropdownCheckboxItems(this.incidentTypes);

    let observ = this.siteService.getSites();
    observ.subscribe(
      data => {
        this.sitesList = data.map((item: any) => {
          return {
            label: item.name,
            value: item.guid,
            checked: true
          };
        });
        this.currentSiteValues = this.getCheckedDropdownCheckboxItems(this.sitesList);
        cb();
      },
      err => console.log('Error loading sites', err)
    );
  }

  loadData(opts?: any) {
    this.getDataByDates()
      .subscribe(
        data => {
          let incidents = this.parseIncidentsByGuardians(data.events);
          console.log('response', incidents);
          let isRefreshed = this.appendNewIncidents(incidents);
          console.log('incidents', this.incidents);
          if (isRefreshed) {
            this.audio.play();
            // we use separate array for map data input because angular ngOnChanges handler
            // doesn't fire when we just append new items to array, so we need this dirty hack
            this.mapIncidents = this.incidents.slice(0);
          }
        },
        err => console.log('Error loading incidents', err)
      );
  }

  getDataByDates(): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('starting_after', this.latestSyncTime.toISOString());
    this.currentIncidentTypeValues.forEach((value: string) => {
      params.append('values[]', value);
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

    this.latestSyncTime.add(this.intervalSec, 'seconds').toISOString();

    // create timer which will be sent every intervalSec seconds starting from 0
    return Observable
             .timer(0, this.intervalSec * 1000)
             .switchMap(() => { return this.http.get(Config.API + 'events/event', options); })
             .map((res) => res.json());
  }

  parseIncidentsByGuardians(incidents: Array<any>) {
    let arr = incidents.map((item) => {
      let obj: any = {
        coords: {
          lat: item.latitude,
          lon: item.longitude
        },
        guid: item.guardian_guid,
        shortname: item.guardian_shortname,
        event_guid: item.event_guid,
        events: {},
        death_time: moment().add(3, 'minutes').toDate()
      };
      obj.events[item.value] = 1;
      return obj;
    });
    return arr;
  };

  appendNewIncidents(incidents: Array<any>): Boolean {
    let isAppended = false;
    incidents.forEach((item) => {
      if (!this.incidents.find((searchItem) => {
        return searchItem.event_guid === item.event_guid;
      })) {
        isAppended = true;
        this.incidents.push(item);
      }
    });
    return isAppended;
  };

  startCleaner() {
    setInterval(() => {
      console.log('Checking death events');
      let oldCount = this.incidents.length;
      this.incidents = this.incidents.filter((item) => {
        return item.death_time.getTime() > new Date().getTime();
      });
      console.log((oldCount - this.incidents.length) + ' will be removed');
    }, 30 * 1000);
  }

  toggleMobileFilters() {
    this.mobileFiltersOpened = !this.mobileFiltersOpened;
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

  siteChanged(event: any) {
    this.currentSiteValues = this.getCheckedDropdownCheckboxItems(event.items);
    if (this.currentSiteValues.length) {
      this.loadData();
    }
    else {
      this.incidents = [];
    }
  }

  incidentsTypeChanged(event: any) {
    this.currentIncidentTypeValues = this.getCheckedDropdownCheckboxItems(event.items);
    if (this.currentIncidentTypeValues.length) {
      this.loadData();
    }
    else {
      this.incidents = [];
    }
  }

}

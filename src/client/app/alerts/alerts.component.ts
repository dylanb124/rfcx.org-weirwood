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

  public incidents: Array<any>;
  public currentIncidentTypeValues: Array<string>;
  public currentSiteValues: Array<string>;
  public mobileFiltersOpened: boolean = false;
  public isLoading: boolean = false;

  constructor(
    public http: Http,
    public cookieService: CookieService,
    public siteService: SiteService
  ) { }

  ngOnInit() {
    // start loading initial data only after loading all sites
    this.initSitesFilter(() => {
      this.loadData({ initial: true });
    });
  }

  initSitesFilter(cb: Function) {
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
    console.log('load data');
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

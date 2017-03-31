import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { GuardianService, SiteService, AudioService } from '../shared/index';
import { PulseOptions } from '../shared/rfcx-map/index';
import { Config } from '../shared/config/env.config.js';

import * as moment from 'moment';
let jQuery: any = (window as any)['$'];

interface RangerMessage {
  message?: string;
  rangerGuid?: string;
  coords?: {
    lat: number,
    lon: number
  };
}

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
    { value: 'chainsaw', label: 'Chainsaws', checked: true },
    { value: 'amazon parrot', label: 'Amazon Parrot', checked: true },
    { value: 'macaw', label: 'Macaw', checked: true }
  ];

  public mapDetails: any = {
    lat: 37.773972,
    lon: -122.431297,
    zoom: 10,
    maxZoom: 17
  };

  public pulseColors: any = {
    chainsaw: '#ff4155',
    shot: '#ff4155',
    vehicle: '#ff4155',
    'amazon parrot': '#2fb04a',
    macaw: '#2fb04a'
  };

  public icon: any = {
    chainsaw: 'danger',
    shot: 'danger',
    vehicle: 'danger',
    'amazon parrot': 'default',
    macaw: 'default'
  };

  public isAlertFormLoading: Boolean = false;
  public isStreamingModeLoading: Boolean = false;
  public incidents: Array<any> = [];
  public mapIncidents: Array<any> = [];
  public rangers: Array<any> = [];
  public rangersGhosts: Array<any> = [];
  public currentIncidentTypeValues: Array<string>;
  public currentSiteValues: Array<string>;
  public currentSiteBounds: Array<string>;
  public currentAudioGuid: string = undefined;
  public autoplayStream: boolean = false;
  public streamTitle: string;
  public mobileFiltersOpened: boolean = false;
  public isLoading: boolean = false;
  // check request will be sent every intervalSec seconds
  public intervalSec: number = 30;
  public deathTimeMin: number = 5;
  public audio: any;
  public loadSubscription: any;
  public rangerMessage: RangerMessage = {};
  public streamingMode: string = 'static';
  public cleanerInterval: any;
  public currentSerialGuardianIndex: number = 0;

  constructor(
    public http: Http,
    public cookieService: CookieService,
    public siteService: SiteService,
    public guardianService: GuardianService,
    public audioService: AudioService
  ) { }

  ngOnInit() {
    // start loading initial data only after loading all sites
    this.initAudio();
    this.intializeFilterValues(() => {
      this.loadData();
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
            bounds: item.bounds,
            checked: true
          };
        });
        this.currentSiteValues = this.getCheckedDropdownCheckboxItems(this.sitesList);
        this.currentSiteBounds = this.getActiveSiteBounds();
        cb();
      },
      err => console.log('Error loading sites', err)
    );
  }

  getActiveSiteBounds() {
    let arr: Array<any> = [];
    this.sitesList.forEach((site: any) => {
      if (site.bounds !== null && site.checked) {
        arr.push(site.bounds);
      }
    });
    return arr;
  }

  resetData() {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
    this.incidents = [];
    this.mapIncidents = [];
    this.rangers = [];
    this.rangersGhosts = [];
  }

  loadData() {
    this.stopCleaner();
    if (this.streamingMode === 'static' || this.streamingMode === 'eventDriven') {
      this.loadIncidents();
    }
    else if (this.streamingMode === 'serial') {
      this.loadGuardians();
    }
  }

  loadIncidents() {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
    this.loadSubscription = this.getDataByDates()
      .subscribe(
        data => {
          let incidents = this.parseIncidentsByGuardians(data.events);
          let isRefreshed = this.appendNewIncidents(incidents);
          console.log('incidents', this.incidents);
          if (isRefreshed) {
            this.audio.play();
            // we use separate array for map data input because angular ngOnChanges handler
            // doesn't fire when we just append new items to array, so we need this dirty hack
            this.mapIncidents = this.incidents.slice(0);
            this.updateStreamingLogic();
          }
        },
        err => console.log('Error loading incidents', err)
      );
    this.startCleaner();
  }

  loadGuardians() {
    let params: URLSearchParams = new URLSearchParams();
    this.currentSiteValues.forEach((value: string) => {
      params.append('sites[]', value);
    });
    this.guardianService.getGuardians({ search: params })
      .subscribe(
        data => {
          console.log('guardians', data);
          this.parseGuardians(data);
          this.mapIncidents = this.incidents.slice(0);
          this.updateStreamingLogic();
        },
        err => console.log('Error loading guardians', err)
      );
  }

  getDataByDates(): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });

    // create timer which will be sent every intervalSec seconds starting from 0
    return Observable
             .timer(0, this.intervalSec * 1000)
             .switchMap(() => {
               return this.http.get(Config.API + 'events/event', new RequestOptions({
                 headers: headers,
                 search: this.combineUrlParams()
               }));
             })
             .map((res) => res.json());
  }

  combineUrlParams() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('created_after', moment().subtract(30, 'seconds').toISOString());
    // params.set('created_before', moment().toISOString());
    params.set('starting_after', moment().subtract(30, 'minutes').toISOString());
    // params.set('ending_before', moment().toISOString());
    this.currentIncidentTypeValues.forEach((value: string) => {
      params.append('values[]', value);
    });
    this.currentSiteValues.forEach((value: string) => {
      params.append('sites[]', value);
    });
    return params;
  }

  parseIncidentsByGuardians(incidents: Array<any>) {
    let arr = incidents.map((item) => {
      let obj: any = {
        coords: {
          lat: item.latitude,
          lon: item.longitude
        },
        time: {
          begins_at: item.begins_at,
          ends_at: item.ends_at
        },
        guid: item.guardian_guid,
        audioGuid: item.audio_guid,
        shortname: item.guardian_shortname,
        site: item.site,
        eventGuid: item.event_guid,
        event: item.value,
        deathTime: moment().add(this.deathTimeMin, 'minutes').toDate(),
        html: this.generageItemHtml({
          str1: item.value,
          str2: item.guardian_shortname + ', ' + item.site
        }),
        fadeOutTime: 3000,
        type: this.icon[item.value] || 'default'
      };
      if (this.streamingMode === 'static') {
        obj.pulseOpts = {
          type: 'appearing',
          duration: 12000,
          shadowColor: this.pulseColors[item.value] || '#30ac4a'
        };
      }
      return obj;
    });
    return arr;
  };

  parseGuardians(guardians: Array<any>) {
    guardians = guardians.filter((guardian: any) => {
      return guardian.location && guardian.location.latitude && guardian.location.longitude;
    });
    this.incidents = guardians.map(this.combineGuardianObject.bind(this));
  }

  combineGuardianObject(guardian: any) {
    return {
      guid: guardian.guid,
      coords: {
        lat: guardian.location.latitude,
        lon: guardian.location.longitude
      },
      html: this.generageItemHtml({
        str1: guardian.shortname
      }),
      fadeOutTime: 3000,
      type: 'guardian'
    }
  }

  generageItemHtml(data: any) {
    let html = '<p class=\"d3-tip__row\">' + data.str1 + '</p>';
    if (data.str2) {
      html += '<p class=\"d3-tip__row\">' + data.str2 + '</p>';
    }
    if (this.streamingMode === 'static') {
      html += '<p class=\"d3-tip__row d3-tip__row_stream\">' +
                '<button class="btn btn-xs d3-tip__btn js-tip-btn">Listen Stream</button>' +
              '</p>';
    }
    return html;
  };

  onPlayClicked(event: any) {
    if (this.currentAudioGuid === event.audioGuid) {
      return;
    }
    this.updateStreamerData(event);
  }

  clearStreamerData() {
    this.currentAudioGuid = null;
    this.autoplayStream = false;
    this.streamTitle = '';
  }

  updateStreamerData(data: any) {
    // remove previously playing stream
    this.clearStreamerData();
    // wait some time and create new one
    setTimeout(() => {
      this.currentAudioGuid = data.audioGuid;
      this.autoplayStream = !!data.autoplay;
      this.streamTitle = data.streamTitle;
    }, 100);
  }

  appendNewIncidents(incidents: Array<any>): Boolean {
    let isAppended = false;
    incidents.forEach((item) => {
      if (!this.incidents.find((searchItem) => {
        return searchItem.eventGuid === item.eventGuid;
      })) {
        isAppended = true;
        this.incidents.push(item);
        let itemTemp = jQuery.extend(true, {}, item);
        itemTemp.coords.lat = itemTemp.coords.lat + 0.01;
        itemTemp.coords.lon = itemTemp.coords.lon - 0.001;
        this.rangers.push(itemTemp);
      }
    });
    return isAppended;
  };

  stopCleaner() {
    if (this.cleanerInterval) {
      clearInterval(this.cleanerInterval);
    }
  }

  startCleaner() {
    this.stopCleaner();
    this.cleanerInterval = setInterval(() => {
      console.log('Checking death events');
      let oldCount = this.incidents.length;
      this.incidents = this.incidents.filter((item) => {
        return item.deathTime.getTime() > new Date().getTime();
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
    this.currentSiteBounds = this.getActiveSiteBounds();
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

  onArrowCreated(event: any) {
    console.log('onArrowCreated', event);
    this.rangerMessage.coords = event.coords;
    this.rangerMessage.rangerGuid = event.guid;
  }

  createRangerGhost() {
    let ranger = this.rangers.find((ranger: any) => {
      return ranger.guid === this.rangerMessage.rangerGuid;
    });
    let rangerGhost = this.rangersGhosts.find((ranger: any) => {
      return ranger.forGuid === this.rangerMessage.rangerGuid;
    });

    if(rangerGhost) {
      this.rangersGhosts = this.rangersGhosts.filter((ranger) => {
        return ranger.guid !== rangerGhost.guid;
      });
    }
    rangerGhost = jQuery.extend(true, {}, ranger);
    rangerGhost.coords = this.rangerMessage.coords;
    rangerGhost.forGuid = this.rangerMessage.rangerGuid;
    this.rangersGhosts.push(rangerGhost);
  }

  clearFormData() {
    this.rangerMessage = {};
  }

  onSubmitAlert() {
    this.isAlertFormLoading = true;
    setTimeout(() => {
      if (this.rangerMessage.rangerGuid) {
        this.createRangerGhost();
      }
      this.clearFormData();
      this.isAlertFormLoading = false;
    }, 2000);
  }

  changeStreamingMode(mode: string) {
    if (this.streamingMode === mode) {
      return;
    }
    this.isStreamingModeLoading = true;
    this.streamingMode = mode;
    this.clearStreamerData();
    this.resetData();
    setTimeout(() => {
      this.loadData();
      this.isStreamingModeLoading = false;
    }, 3000);
  }

  clearAllPulseOpts() {
    this.incidents.forEach((incident: any) => {
      if (incident.pulseOpts) {
        delete incident.pulseOpts;
      }
    });
  }

  loadAudioForGuardian(guardian: any) {
    return this.audioService.getAudioByGuardian({
      guid: guardian.guid,
      starting_after: moment().subtract(30, 'minutes').toISOString(),
      ending_before: moment().add(1, 'minute').toISOString(),
      order: 'descending',
      limit: 1
    });
  }

  playNextGuardianAudio() {
    if (!this.incidents.length) {
      return;
    }
    let guardian = this.incidents[this.currentSerialGuardianIndex];
    this.loadAudioForGuardian(guardian)
      .subscribe(
        data => {
          this.clearAllPulseOpts();
          guardian.pulseOpts = {
            type: 'streaming',
            shadowColor: '#4a90ff'
          };
          this.updateStreamerData({
            audioGuid: data[0].guid,
            autoplay: true,
            streamTitle: guardian.shortname
          });
          this.increaseCurrentSerialGuardianIndex();
          setTimeout(this.playNextGuardianAudio.bind(this), 30000);
        },
        err => {
          console.log('Error loading audio for guardians', err);
          this.increaseCurrentSerialGuardianIndex();
          this.playNextGuardianAudio();
        }
      )
  }

  increaseCurrentSerialGuardianIndex() {
    if (this.currentSerialGuardianIndex + 1 < this.incidents.length) {
      this.currentSerialGuardianIndex++;
    }
    else {
      this.currentSerialGuardianIndex = 0;
    }
  }

  playLatestAlertAudio() {
    let latestIncident = this.incidents[this.incidents.length-1];
    latestIncident.pulseOpts = {
      type: 'streaming',
      shadowColor: '#4a90ff'
    }
    this.updateStreamerData({
      audioGuid: latestIncident.audioGuid,
      autoplay: true,
      streamTitle: latestIncident.shortname + ', ' + latestIncident.site
    });
  }

  updateStreamingLogic() {
    if (this.streamingMode === 'eventDriven') {
      this.clearAllPulseOpts();
      this.playLatestAlertAudio();
    }
    else if (this.streamingMode === 'serial') {
      this.clearAllPulseOpts();
      this.playNextGuardianAudio();
    }
  }

}

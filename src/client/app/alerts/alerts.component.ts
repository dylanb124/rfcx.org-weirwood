import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { DropdownItem } from '../shared/dropdown/dropdown-item';
import { DropdownCheckboxItem } from '../shared/dropdown-checkboxes/dropdown-item';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { GuardianService, SiteService, AudioService } from '../shared/index';
import { PulseOptions } from '../shared/rfcx-map/index';
import { Config } from '../shared/config/env.config.js';
import { AudioNotifier } from '../shared/audio-notifier/index';

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

export class AlertsComponent implements OnInit, OnDestroy {

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

  public colors: any = {
    dodgerBlue: '#4a90ff',
    rfcxGreen: '#30ac4a'
  }

  public isAlertFormLoading: Boolean = false;
  public isStreamingModeLoading: Boolean = false;
  public incidents: Array<any> = [];
  public incidentsSerial: Array<any> = [];
  public mapIncidents: Array<any> = [];
  public rangers: Array<any> = [];
  public rangersGhosts: Array<any> = [];
  public currentIncidentTypeValues: Array<string>;
  public currentSiteValues: Array<string>;
  public currentSiteBounds: Array<string>;
  public currentAudioGuid: string = undefined;
  public autoplayStream: boolean = false;
  public streamLoadNext: boolean = true;
  public streamTitle: string;
  public mobileFiltersOpened: boolean = false;
  public isLoading: boolean = false;
  // check request will be sent every intervalSec seconds
  public intervalSec: number = 30;
  public deathTimeMin: number = 5;
  public loadIncidentsSubscription: any;
  public loadGuardiansSubscription: any;
  public loadGuardiansAudioSubscription: any;
  public rangerMessage: RangerMessage = {};
  public streamingMode: string = 'static';
  public cleanerInterval: any;
  public serialModeTimeout: any;
  public changeStreamingModeTimeout: any;
  public currentSerialGuardianIndex: number = 0;
  public successfullSerialLoopPlaybacks: number = 0;
  public serialModePaused: Boolean = false;
  public serialModeStopped: Boolean = false;

  constructor(
    public http: Http,
    public cookieService: CookieService,
    public siteService: SiteService,
    public guardianService: GuardianService,
    public audioService: AudioService,
    public notifier: AudioNotifier
  ) { }

  ngOnInit() {
    // start loading initial data only after loading all sites
    this.intializeFilterValues(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.clearSerialModeData();
    this.resetData();
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
    if (this.loadIncidentsSubscription) {
      this.loadIncidentsSubscription.unsubscribe();
    }
    if (this.loadGuardiansSubscription) {
      this.loadGuardiansSubscription.unsubscribe();
    }
    if (this.loadGuardiansAudioSubscription) {
      this.loadGuardiansAudioSubscription.unsubscribe();
    }
    if (this.changeStreamingModeTimeout) {
      clearTimeout(this.changeStreamingModeTimeout);
    }
    this.incidents = [];
    this.incidentsSerial = [];
    this.mapIncidents = [];
    this.rangers = [];
    this.rangersGhosts = [];
  }

  loadData() {
    this.stopCleaner();
    if (this.streamingMode === 'static' || this.streamingMode === 'eventDriven') {
      this.loadIncidents(this.onLoadIncidentsCommom);
      this.startCleaner();
    }
    else if (this.streamingMode === 'serial') {
      this.loadGuardians();
    }
  }

  onLoadIncidentsCommom(data: any) {
    let incidents = this.parseIncidentsByGuardians(data.events);
    let isRefreshed = this.appendNewIncidents(incidents, this.incidents);
    console.log('incidents', this.incidents);
    if (isRefreshed) {
      this.notifier.alert();
      // we use separate array for map data input because angular ngOnChanges handler
      // doesn't fire when we just append new items to array, so we need this dirty hack
      this.mapIncidents = this.incidents.slice(0);
      this.updateStreamingLogic();
    }
  }

  loadIncidents(cb: any) {
    if (this.loadIncidentsSubscription) {
      this.loadIncidentsSubscription.unsubscribe();
    }
    this.loadIncidentsSubscription = this.getDataByDates()
      .subscribe(
        cb.bind(this),
        err => console.log('Error loading incidents', err)
      );
  }

  loadGuardians() {
    if (this.loadGuardiansSubscription) {
      this.loadGuardiansSubscription.unsubscribe();
    }
    let params: URLSearchParams = new URLSearchParams();
    this.currentSiteValues.forEach((value: string) => {
      params.append('sites[]', value);
    });
    this.loadGuardiansSubscription = this.guardianService.getGuardians({ search: params })
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
        guardianGuid: item.guardian_guid,
        audioGuid: item.audio_guid,
        shortname: item.guardian_shortname,
        site: item.site,
        guid: item.event_guid,
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
          shadowColor: this.pulseColors[item.value] || this.colors.rfcxGreen
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
      shortname: guardian.shortname,
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
      this.streamLoadNext = data.loadNext === undefined? true : data.loadNext,
      this.streamTitle = data.streamTitle;
    }, 100);
  }

  appendNewIncidents(incidentsFrom: Array<any>, incidentsTo: Array<any>): Boolean {
    let isAppended = false;
    incidentsFrom.forEach((item) => {
      if (!incidentsTo.find((searchItem) => {
        return searchItem.guid === item.guid ||
               searchItem.audioGuid === item.audioGuid ||
               searchItem.guardianGuid === item.guardianGuid;
      })) {
        isAppended = true;
        incidentsTo.push(item);
        // let itemTemp = jQuery.extend(true, {}, item);
        // itemTemp.coords.lat = itemTemp.coords.lat + 0.01;
        // itemTemp.coords.lon = itemTemp.coords.lon - 0.001;
        // this.rangers.push(itemTemp);
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
    this.changeStreamingModeTimeout = setTimeout(() => {
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
    this.clearAudioDownloadSubscr();
    let guardian = this.incidents[this.currentSerialGuardianIndex];
    this.loadGuardiansAudioSubscription = this.loadAudioForGuardian(guardian)
      .subscribe(
        data => {
          this.clearAllPulseOpts();
          console.log("this", this);
          guardian.pulseOpts = {
            type: 'streaming',
            shadowColor: this.colors.dodgerBlue
          };
          this.updateStreamerData({
            audioGuid: data[0].guid,
            autoplay: true,
            loadNext: true,
            streamTitle: guardian.shortname
          });
          this.increaseCurrentSerialGuardianIndex();
          this.successfullSerialLoopPlaybacks++;
          this.serialModeTimeout = setTimeout(this.playNextGuardianAudio.bind(this), 30000);
        },
        err => {
          console.log('Error loading audio for guardians', err);
          if (this.increaseCurrentSerialGuardianIndex()) {
            this.playNextGuardianAudio();
          }
          else {
            // try again in 1 minute
            this.serialModeTimeout = setTimeout(this.playNextGuardianAudio.bind(this), 60000);
          }
        }
      )
  }

  increaseCurrentSerialGuardianIndex() {
    if (this.currentSerialGuardianIndex + 1 < this.incidents.length) {
      this.currentSerialGuardianIndex++;
      return true;
    }
    else {
      this.currentSerialGuardianIndex = 0;
      if (this.successfullSerialLoopPlaybacks > 0) {
        this.successfullSerialLoopPlaybacks = 0;
        return true;
      }
      else {
        return false;
      }
    }
  }

  playLatestAlertAudio() {
    let latestIncident = this.incidents[this.incidents.length-1];
    latestIncident.pulseOpts = {
      type: 'streaming',
      shadowColor: this.colors.dodgerBlue
    }
    this.updateStreamerData({
      audioGuid: latestIncident.audioGuid,
      autoplay: true,
      loadNext: true,
      streamTitle: latestIncident.shortname + ', ' + latestIncident.site
    });
  }

  updateStreamingLogic() {
    this.clearSerialModeData();
    if (this.streamingMode === 'eventDriven') {
      this.clearAllPulseOpts();
      this.playLatestAlertAudio();
    }
    else if (this.streamingMode === 'serial') {
      this.clearAllPulseOpts();
      this.playNextGuardianAudio();
      this.startSerialAlertsChecker();
    }
  }

  clearAudioDownloadSubscr() {
    if (this.loadGuardiansAudioSubscription) {
      this.loadGuardiansAudioSubscription.unsubscribe();
    }
  }

  clearSerialModeData() {
    this.successfullSerialLoopPlaybacks = 0;
    if (this.serialModeTimeout) {
      clearTimeout(this.serialModeTimeout);
    }
  }

  startSerialAlertsChecker() {
    this.loadIncidents((data: any) => {
      let incidents = this.parseIncidentsByGuardians(data.events);
      let isRefreshed = this.appendNewIncidents(incidents, this.incidentsSerial);
      if (this.incidentsSerial.length && isRefreshed) {
        let incident = this.incidentsSerial[this.incidentsSerial.length - 1];
        let guardian = this.incidents.find((item: any) => {
          return item.guid === incident.guardianGuid
        });
        if (guardian) {
          this.clearAudioDownloadSubscr();
          this.clearStreamerData();
          this.clearSerialModeData();

          this.notifier.alert();
          this.clearAllPulseOpts();
          guardian.pulseOpts = {
            type: 'streaming',
            shadowColor: this.pulseColors[incident.event] || this.colors.dodgerBlue
          };
          this.updateStreamerData({
            audioGuid: incident.audioGuid,
            autoplay: true,
            loadNext: false,
            streamTitle: guardian.shortname
          });
          this.mapIncidents = this.incidents.slice(0);
        }
      }
    });
  }

  playPauseSerialMode() {
    if (!this.serialModePaused) {
      this.clearSerialModeData();
    }
    else {
      this.playNextGuardianAudio();
    }
    this.serialModePaused = !this.serialModePaused;
  }

  playStopSerialMode() {
    if (!this.serialModeStopped) {
      this.clearStreamerData();
      this.clearAllPulseOpts();
      this.clearSerialModeData();
    }
    else {
      this.currentSerialGuardianIndex = 0;
      this.playNextGuardianAudio();
    }
    this.serialModeStopped = !this.serialModeStopped;
  }

  onStreamEnded() {
    if (this.streamingMode === 'serial') {
      this.clearAllPulseOpts();
      if (this.serialModePaused || this.serialModeStopped) {
        return;
      }
      this.updateStreamingLogic();
    }
  }

}

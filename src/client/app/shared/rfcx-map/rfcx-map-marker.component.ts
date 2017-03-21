import { Component, Input, Output, Inject, forwardRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import { rfcxMapIcon } from './icon';
import { PulseOptions } from './pulse-options';

import * as L from 'leaflet';
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-marker',
  template: ''
})
export class RfcxMapMarkerComponent implements OnInit, OnDestroy {

  @Input() lat: number;
  @Input() lon: number;
  @Input() pulseOpts?: PulseOptions;
  @Input() popupHtml: string;
  @Input() data: any;
  @Output() onPlayClick = new EventEmitter();
  public rfcxMapComp: any;
  public marker: any;
  public popup: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.appendToMap();
    if (this.popupHtml) {
      this.createPopup();
      setTimeout(() => {
        this.emitPlayBtnEvent();
      });
    }
  }

  ngOnDestroy() {
    // if item is pulsated, then delete it with fade effect
    if (this.pulseOpts) {
      // this attribute is required for map component, so it ignores this item when wants to calculate new map bounds
      this.marker.options.isDeleting = true;
      jQuery(this.marker._icon).fadeOut(this.pulseOpts.duration.fadeOut, () => {
        this.removeFromMap();
      });
    }
    else {
      this.removeFromMap();
    }
  }

  appendToMap() {
    this.marker = L.marker([this.lat, this.lon], { icon: rfcxMapIcon });
    this.marker.addTo(this.rfcxMapComp.rfcxMap);
    // if maker is pulsated, then append pulse css class to it's icon
    if (this.pulseOpts) {
      jQuery(this.marker._icon).css('color', this.pulseOpts.shadowColor);
      jQuery(this.marker._icon).addClass('pulse');
      // and remove that class after 8 secs
      setTimeout(() => {
        jQuery(this.marker._icon).removeClass('pulse');
      }, this.pulseOpts.duration.pulse);
    }
  }

  removeFromMap() {
    this.rfcxMapComp.rfcxMap.removeLayer(this.marker);
    if (this.popup) {
      this.rfcxMapComp.rfcxMap.closePopup();
    }
  }

  bindAdditionalEvents() {
    if (this.onPlayClick) {
      jQuery('.js-tip-btn').click(() => {
        this.emitPlayBtnEvent();
      });
    }
  }

  createPopup() {
    let self = this;
    this.popup = L.popup({ className: 'd3-tip n' })
      .setLatLng([this.lat, this.lon])
      .setContent(() => { return this.popupHtml; });
    this.marker.bindPopup(this.popup);
    this.marker.on('click', function () {
      this.openPopup();
      self.bindAdditionalEvents();
    });
  }

  emitPlayBtnEvent() {
    this.onPlayClick.emit({
      audioGuid: this.data.audioGuid,
      autoplay: true,
      streamTitle: this.data.shortname + ', ' + this.data.site
    });
  }
}

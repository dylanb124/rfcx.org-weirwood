import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import { rfcxMapIcon } from './icon';

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
  @Input() pulse?: boolean;
  @Input() pulseDuration: number = 8000;
  @Input() fadeOutDuration: number = 3000;
  public rfcxMapComp: any;
  public marker: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.appendToMap();
  }

  ngOnDestroy() {
    // if item is pulsated, then delete it with fade effect
    if (this.pulse) {
      // this attribute is required for map component, so it ignores this item when wants to calculate new map bounds
      this.marker.options.isDeleting = true;
      jQuery(this.marker._icon).fadeOut(this.fadeOutDuration, () => {
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
    if (this.pulse) {
      jQuery(this.marker._icon).addClass('pulse');
      // and remove that class after 8 secs
      setTimeout(() => {
        jQuery(this.marker._icon).removeClass('pulse');
      }, this.pulseDuration);
    }
  }

  removeFromMap() {
    this.rfcxMapComp.rfcxMap.removeLayer(this.marker);
  }
}

import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import { rfcxMapIcon } from './icon';

import * as L from 'leaflet';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-site-bound',
  template: ''
})
export class RfcxMapSiteBoundComponent implements OnInit, OnDestroy {

  @Input() bounds: any;
  public rfcxMapComp: any;
  public layer: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.createLayerFromBounds();
    this.appendToMap();
  }

  createLayerFromBounds() {
    let opts = {
      type: 'Feature',
      properties: {
        style: {
          color: '#d4a5e9',
          opacity: 0.8,
          fillColor: 'transparent',
          fillOpacity: 0
        }
      },
      geometry: this.bounds
    }
    this.layer = L.geoJSON(opts, {
      style: (feature: any) => {
        return feature.properties.style;
      }
    });
  }

  ngOnDestroy() {
    this.removeFromMap();
  }

  appendToMap() {
    this.layer.addTo(this.rfcxMapComp.rfcxMap);
  }

  removeFromMap() {
    this.rfcxMapComp.rfcxMap.removeLayer(this.layer);
  }
}

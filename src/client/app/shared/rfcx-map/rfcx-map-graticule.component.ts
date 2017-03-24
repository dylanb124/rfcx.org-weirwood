import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';

import * as L from 'leaflet';
import 'leaflet.graticule';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-graticule',
  template: ''
})
export class RfcxMapGraticuleComponent implements OnInit, OnDestroy {

  // @Input() bounds: any;
  public rfcxMapComp: any;
  public layer: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    (<any>L).latlngGraticule({
        showLabel: false,
        color: '#FF0000',
        zoomInterval: [
          {start: 17, end: 17, interval: 0.0001},
        ]
    }).addTo(this.rfcxMapComp.rfcxMap);
  }

  ngOnDestroy() {

  }
}

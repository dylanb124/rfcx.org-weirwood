import { Component, Input, Inject, forwardRef } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';

let baseMapType: any = {
    'positron': {
      'url': 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    'darkmatter': {
      'url': 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  };

@Component({
  moduleId: module.id,
  selector: 'rfcx-basemap',
  template: ''
})
export class RfcxBaseMapComponent {

    private rfcxMapComp: any;
    @Input() layerType: string;

    constructor(
        @Inject(forwardRef(() => RfcxMapComponent)) map:RfcxMapComponent
    ) {
        this.rfcxMapComp = map;
    }

    ngOnInit() {
        this.appendLayer();
    }

    appendLayer() {
        let layerOpts = baseMapType[this.layerType];
        if (!layerOpts || this.rfcxMapComp === undefined || this.rfcxMapComp.rfcxMap === undefined) {
            return;
        }
        let layerObj = L.tileLayer(layerOpts.url, { attribution: layerOpts.attribution });
        this.rfcxMapComp.rfcxMap.addLayer(layerObj);
    }
}

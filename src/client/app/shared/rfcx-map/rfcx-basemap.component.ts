import { Component, Input, Inject, forwardRef, OnInit } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';

let baseMapTypes: any = {
  'satellite': {
    'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // tslint:disable-next-line:max-line-length
    'attribution': '&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  'positron': {
    'url': 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
    // tslint:disable-next-line:max-line-length
    'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  'darkmatter': {
    'url': 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
    // tslint:disable-next-line:max-line-length
    'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

@Component({
  moduleId: module.id,
  selector: 'rfcx-basemap',
  template: ''
})
export class RfcxBaseMapComponent implements OnInit {

  @Input() layerType: string;
  private rfcxMapComp: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.appendLayer();
  }

  appendLayer() {
    let layerOpts = baseMapTypes[this.layerType];
    if (!layerOpts || this.rfcxMapComp === undefined || this.rfcxMapComp.rfcxMap === undefined) {
      return;
    }
    let layerObj = L.tileLayer(layerOpts.url, {
      attribution: layerOpts.attribution,
      type: this.layerType,
      leafletType: 'mapLayer'
    });
    this.rfcxMapComp.rfcxMap.addLayer(layerObj);
  }
}

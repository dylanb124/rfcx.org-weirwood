import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';

let iconSize: any = [20, 28];

const mapIcon = L.icon({
  iconUrl: 'assets/img/map/location-marker@2x.png',
  iconSize: iconSize,
  iconAnchor: [10, 28],
  className: 'rfcx-map-marker'
});

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-marker',
  template: ''
})
export class RfcxMapMarkerComponent implements OnInit, OnDestroy {

  @Input() lat: number;
  @Input() lon: number;
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
    this.rfcxMapComp.rfcxMap.removeLayer(this.marker);
  }

  appendToMap() {
    this.marker = L.marker([this.lat, this.lon], { icon: mapIcon });
    this.marker.addTo(this.rfcxMapComp.rfcxMap);
  }
}

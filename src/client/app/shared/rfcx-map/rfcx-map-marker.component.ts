import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';

let iconSize: any = [20, 28];

const mapIcon = L.icon({
    iconUrl: 'assets/img/map/location-marker@2x.png',
    iconSize: iconSize,
    iconAnchor: [10, 28],
    className: 'mapMarker'
});

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-marker',
  template: ''
})
export class RfcxMapMarkerComponent implements OnInit, OnDestroy {

    @Input() lat: number;
    @Input() lon: number;
    private rfcxMapComp: any;
    private marker: any;

    constructor(
        @Inject(forwardRef(() => RfcxMapComponent)) map:RfcxMapComponent
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
        this.marker = L.marker([this.lat, this.lon], {icon: mapIcon}).addTo(this.rfcxMapComp.rfcxMap);
    }
}

import { Component, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map',
  templateUrl: 'rfcx-map.component.html',
  styleUrls: ['rfcx-map.component.css']
})
export class RfcxMapComponent {

    // internal id for twitter bootstrap dropdown interaction
    private mapId: number = Math.round(Math.random() * 10000000);
    private rfcxMap: any;
    private centerLat: number = 37.773972;
    private centerLon: number = -122.431297;
    private zoom: number = 13;

    constructor() {}

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        let mapOptions: L.MapOptions = {
            center: [this.centerLat, this.centerLon],
            zoom: this.zoom
        };

        this.rfcxMap = L.map('rfcxMapId', mapOptions);
    }

}

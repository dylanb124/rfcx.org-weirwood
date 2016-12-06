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
    @Input() private centerLat: number;
    @Input() private centerLon: number;
    @Input() private zoom: number;

    constructor() {}

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        if (!this.centerLat || !this.centerLon || !this.zoom) {
            throw Error('Map does not have all attributes');
        }
        let mapOptions: L.MapOptions = {
            center: [this.centerLat, this.centerLon],
            zoom: this.zoom
        };

        this.rfcxMap = L.map('rfcxMapId', mapOptions);
    }

}

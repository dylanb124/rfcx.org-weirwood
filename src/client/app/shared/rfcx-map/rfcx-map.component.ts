import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map',
  templateUrl: 'rfcx-map.component.html',
  styleUrls: ['rfcx-map.component.css'],
})
export class RfcxMapComponent {

    // internal id for twitter bootstrap dropdown interaction
    private mapId: number = Math.round(Math.random() * 10000000);
    private rfcxMap: any;
    private centerLat: number = 37.773972;
    private centerLon: number = -122.431297;
    private zoom: number = 13;
    // @Output() onChange = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        let baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }
        );
        this.rfcxMap = new L.Map('rfcxMapId', {
            center: [this.centerLat, this.centerLon],
            zoom: this.zoom
        });
        this.rfcxMap.addLayer(baseLayer);
    }

}

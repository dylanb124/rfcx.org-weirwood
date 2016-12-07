import { Component, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map',
  templateUrl: 'rfcx-map.component.html',
  styleUrls: ['rfcx-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RfcxMapComponent {

    private rfcxMap: any;
    @Input() private centerLat: number;
    @Input() private centerLon: number;
    @Input() private zoom: number;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.initMap();
        this.initLayerControls();
    }

    initMap() {
        // get native html object of rfcx-map div, because dynamic id dissapears when leaflet tries to get it
        let mapHtmlObj = this.elementRef.nativeElement.getElementsByClassName('rfcx-map')[0]
        if (!this.centerLat || !this.centerLon || !this.zoom) {
            throw Error('Map does not have all attributes');
        }
        let mapOptions: L.MapOptions = {
            center: [this.centerLat, this.centerLon],
            zoom: this.zoom
        };

        this.rfcxMap = L.map(mapHtmlObj, mapOptions);
    }

    initLayerControls() {
        let controlsObj:any = {};
        // wait until all nested rfcx-basemap will be added to map
        setTimeout(() => {
            // iterate through all map layers
            this.rfcxMap.eachLayer(function(layer:any){
                controlsObj[layer.options.type] = layer;
            });
            // add layer selection control
            L.control.layers(controlsObj).addTo(this.rfcxMap);
        }, 2000)
    }

}

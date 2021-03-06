import { Component, Input, ElementRef, ViewEncapsulation, OnInit, OnChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  moduleId: module.id,
  selector: 'rfcx-map',
  templateUrl: 'rfcx-map.component.html',
  styleUrls: ['rfcx-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RfcxMapComponent implements OnInit, OnChanges {

  public rfcxMap: any;
  @Input() data: Array<any>;
  @Input() centerLat: number;
  @Input() centerLon: number;
  @Input() zoom: number;
  @Input() minZoom?: number;
  @Input() maxZoom?: number;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.initMap();
    this.initLayerControls();
    this.calculateAndFitMapBounds();
  }

  initMap() {
    // get native html object of rfcx-map div, because dynamic id dissapears when leaflet tries to get it
    let mapHtmlObj = this.elementRef.nativeElement.getElementsByClassName('rfcx-map')[0];
    if (!this.centerLat || !this.centerLon || !this.zoom) {
      throw Error('Map does not have all attributes');
    }
    let mapOptions: L.MapOptions = {
      center: [this.centerLat, this.centerLon],
      zoom: this.zoom,
      scrollWheelZoom: false,
    };
    if (this.minZoom) {
      mapOptions.minZoom = this.minZoom;
    }
    if (this.maxZoom) {
      mapOptions.maxZoom = this.maxZoom;
    }

    this.rfcxMap = L.map(mapHtmlObj, mapOptions);
  }

  initLayerControls() {
    let controlsObj: any = {};
    // wait until all nested rfcx-basemap will be added to map
    setTimeout(() => {
      // iterate through all map layers
      this.rfcxMap.eachLayer(function (layer: any) {
        if (layer.options && layer.options.leafletType && layer.options.leafletType === 'mapLayer') {
          controlsObj[layer.options.type] = layer;
        }
      });
      // add layer selection control
      L.control.layers(controlsObj).addTo(this.rfcxMap);
    }, 2000);
  }

  calculateAndFitMapBounds() {
    let markers: Array<any> = [];
    setTimeout(() => {
      // iterate through all map layers
      this.rfcxMap.eachLayer(function (layer: any) {
        if (layer.options && layer.options.icon && layer.options.icon.options &&
          layer.options.icon.options.className === 'rfcx-map-marker' && !layer.options.isDeleting) {
          markers.push(layer.getLatLng());
        }
      });
      if (markers.length) {
        let bounds = L.latLngBounds(markers);
        this.rfcxMap.flyToBounds(bounds, {
          padding: [30, 30],
          maxZoom: 13
        });
      }
    }, 2000);
  }

  ngOnChanges(changes: any) {
    if (changes.data && !changes.data.isFirstChange()) {
      this.calculateAndFitMapBounds();
    }
  }

}

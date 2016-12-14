import { Component, Input, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

let iconSize: any = [20, 28];

const mapIcon = L.icon({
    iconUrl: 'assets/img/map/location-marker@2x.png',
    iconSize: iconSize,
    iconAnchor: [10, 28]
});

@Component({
  moduleId: module.id,
  selector: 'rfcx-map',
  templateUrl: 'rfcx-map.component.html',
  styleUrls: ['rfcx-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RfcxMapComponent implements OnInit {

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
        let mapHtmlObj = this.elementRef.nativeElement.getElementsByClassName('rfcx-map')[0];
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

            this.loadMapData();
        }, 2000);
    }

    loadMapData() {
        // temporary demo marker 1
        this.createMarker(this.centerLat, this.centerLon);
        // temporary demo marker's pie 1
        this.createD3Pies(this.centerLat, this.centerLon, [
            {count: 70, label: 'vehicles'},
            {count: 19, label: 'shots'},
            {count: 40, label: 'chainsaws'}
        ]);

        // temporary demo marker 1
        this.createMarker(this.centerLat - 0.015, this.centerLon + 0.03);
        // temporary demo marker's pie 1
        this.createD3Pies(this.centerLat - 0.015, this.centerLon + 0.03, [
            {count: 1, label: 'vehicles'},
            {count: 30, label: 'shots'},
            {count: 10, label: 'chainsaws'}
        ]);
    }

    createMarker(lat: number, lon: number) {
        L.marker([lat, lon], {icon: mapIcon}).addTo(this.rfcxMap);
    }

    createD3Pies(lat: number, lon: number, data: any) {
        // define default pie sizes
        let width = 128,
            height = 128,
            radius = Math.min(width, height) / 2;

        // create svg element object which we will append to leaflet
        let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // get d3 representation of svg object
        let svg = d3.select(svgEl);

        // define colors for arc
        let color = d3
            .scaleOrdinal()
            .range([
                'rgba(240, 65, 84, 0.8)',
                'rgba(34, 176, 163, 0.8)',
                'rgba(245, 166, 35, 0.8)',
                'rgba(107, 72, 107, 0.8)',
                'rgba(160, 93, 86, 0.8)',
                'rgba(208, 116, 60, 0.8)',
                'rgba(255, 140, 0, 0.8)'
            ]);

        // define sizes for arcs
        let arc:any = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 11);

        // define method for pie creation
        let pie = d3.pie()
            .sort(null)
            .value((d:any) => { return d.count; });

        // create g element where we will store our arcs
        let parentG = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // append our arcs to parent g element
        let g = parentG.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // fill arcs with colors
        g.append('path')
            .attr('d', arc)
            .style('fill', (d:any):any => { return color(d.data.label); });

        // create divIcon object which we will append to leaflet
        let icon = L.divIcon({
            // serialize svg to html
            html: this.serializeXmlNode(svgEl),
            className: 'marker-cluster',
            // place pie so leaflet marker is in the middle of a circle
            iconSize: L.point(width, height + iconSize[1])
        });

        // append marker to map
        L.marker([lat, lon], {icon: icon}).addTo(this.rfcxMap);

    }

    // serialize svg
    serializeXmlNode(xmlNode:any) {
        if (typeof (window as any).XMLSerializer !== 'undefined') {
            return (new (window as any).XMLSerializer()).serializeToString(xmlNode);
        } else if (typeof xmlNode.xml !== 'undefined') {
            return xmlNode.xml;
        }
        return '';
    }

}

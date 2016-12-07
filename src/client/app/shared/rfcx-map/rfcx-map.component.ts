import { Component, Input, ElementRef, ViewEncapsulation } from '@angular/core';
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
export class RfcxMapComponent {

    private rfcxMap: any;
    @Input() private centerLat: number;
    @Input() private centerLon: number;
    @Input() private zoom: number;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        console.dir(d3);
        this.initMap();
        this.initLayerControls();
        // temporary demo marker
        this.createMarker(this.centerLat, this.centerLon);
        this.createD3Pie();
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

    createMarker(lat: number, lon: number) {
        L.marker([lat, lon], {icon: mapIcon}).addTo(this.rfcxMap);
    }

    createD3Pie() {
        let _this = this;

        let width = 128,
            height = 128,
            radius = Math.min(width, height) / 2;

        let color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        let arc:any = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 11);

        let pie = d3.pie()
            .sort(null)
            .value((d:any) => { return d.population; });

        let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let svg = d3.select(svgEl);
        let parentG = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.csv("assets/data.csv", type, function(error, data) {
            if (error) throw error;

            let g = parentG.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", (d:any):any => { return color(d.data.age); });

            let ic = L.divIcon({
                html: serializeXmlNode(svgEl),
                className: 'marker-cluster',
                iconSize: L.point(width, height + iconSize[1])
            });
            L.marker([_this.centerLat, _this.centerLon], {icon: ic}).addTo(_this.rfcxMap);
        });

        function serializeXmlNode(xmlNode:any) {
            if (typeof (window as any).XMLSerializer != "undefined") {
                return (new (window as any).XMLSerializer()).serializeToString(xmlNode);
            } else if (typeof xmlNode.xml != "undefined") {
                return xmlNode.xml;
            }
            return "";
        }

        function type(d:any) {
            d.population = +d.population;
            return d;
        }

    }

}

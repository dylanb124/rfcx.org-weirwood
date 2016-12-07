import { Component, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

const mapIcon = L.icon({
    iconUrl: 'assets/img/map/location-marker@2x.png',
    iconSize: [20, 28],
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
        let width = 960,
            height = 500,
            radius = Math.min(width, height) / 2;

        let color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        let arc:any = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        let pie = d3.pie()
            .sort(null)
            .value((d:any) => { return d.population; });

        let svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.csv("assets/data.csv", type, function(error, data) {
            if (error) throw error;

            let g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", (d:any):any => { return color(d.data.age); });

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text((d:any):any => { return d.data.age; });
        });

        function type(d:any) {
            d.population = +d.population;
            return d;
        }




        let ic = L.divIcon({
            html: '<div class="ddddddd" style="background: #ff0000;">aaa</div>"',
            className: 'marker-cluster',
            iconSize: L.point(10, 10)
        });
        L.marker([this.centerLat, this.centerLon], {icon: ic}).addTo(this.rfcxMap);
    }

}

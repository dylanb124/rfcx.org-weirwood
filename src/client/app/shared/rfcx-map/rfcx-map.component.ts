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
        var width = 960,
            height = 500,
            radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        var pie = d3.pie()
            .sort(null)
            .value((d:any) => { return d.population; });

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.csv("assets/data.csv", type, function(error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.age); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.age; });
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

    // bakeThePie(options: any) {
    //     /*data and valueFunc are required*/
    //     if (!options.data || !options.valueFunc) {
    //         return '';
    //     }
    //     var data = options.data,
    //         valueFunc = options.valueFunc,
    //         r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
    //         rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
    //         strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
    //         pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
    //         pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
    //         pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
    //         pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
    //         pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label

    //         origo = (r+strokeWidth), //Center coordinate
    //         w = origo*2, //width and height of the svg element
    //         h = w,
    //         donut = d3.layout.pie(),
    //         arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);

    //     //Create an svg element
    //     var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    //     //Create the pie chart
    //     var vis = d3.select(svg)
    //         .data([data])
    //         .attr('class', pieClass)
    //         .attr('width', w)
    //         .attr('height', h);

    //     var arcs = vis.selectAll('g.arc')
    //         .data(donut.value(valueFunc))
    //         .enter().append('svg:g')
    //         .attr('class', 'arc')
    //         .attr('transform', 'translate(' + origo + ',' + origo + ')');

    //     arcs.append('svg:path')
    //         .attr('class', pathClassFunc)
    //         .attr('stroke-width', strokeWidth)
    //         .attr('d', arc)
    //         .append('svg:title')
    //         .text(pathTitleFunc);

    //     vis.append('text')
    //         .attr('x',origo)
    //         .attr('y',origo)
    //         .attr('class', pieLabelClass)
    //         .attr('text-anchor', 'middle')
    //         //.attr('dominant-baseline', 'central')
    //         /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
    //         .attr('dy','.3em')
    //         .text(pieLabel);
    //     //Return the svg-markup rather than the actual element
    //     return serializeXmlNode(svg);
    // }

    // serializeXmlNode(xmlNode: any) {
    //     if (typeof window.XMLSerializer != "undefined") {
    //         return (new window.XMLSerializer()).serializeToString(xmlNode);
    //     } else if (typeof xmlNode.xml != "undefined") {
    //         return xmlNode.xml;
    //     }
    //     return "";
    // }

}

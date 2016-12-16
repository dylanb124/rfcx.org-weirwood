import { Component, Input, Inject, forwardRef, OnInit } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';
import * as d3 from 'd3';

let iconSize: any = [20, 28];

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-pie',
  template: ''
})
export class RfcxMapPieComponent implements OnInit {

    @Input() centerLat: number;
    @Input() centerLon: number;
    @Input() diameter: number;
    @Input() data: Array<any>;
    private rfcxMapComp: any;

    constructor(
        @Inject(forwardRef(() => RfcxMapComponent)) map:RfcxMapComponent
    ) {
        this.rfcxMapComp = map;
    }

    ngOnInit() {
        this.createD3Pie();
    }

    createD3Pie() {
        // define default pie sizes
        let width  = this.diameter,
            height = this.diameter,
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
            .data(pie(this.data))
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
        L.marker([this.centerLat, this.centerLon], {icon: icon}).addTo(this.rfcxMapComp.rfcxMap);

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
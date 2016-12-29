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
    private marker: any;
    private dia: number;

    constructor(
        @Inject(forwardRef(() => RfcxMapComponent)) map:RfcxMapComponent
    ) {
        this.rfcxMapComp = map;
    }

    ngOnInit() {
        this.dia = this.diameter;
        this.bindMapEvents();
        this.createMarker(this.createIcon());
    }

    bindMapEvents() {
        this.rfcxMapComp.rfcxMap.on('zoomend', () => {
            let zoom = this.rfcxMapComp.rfcxMap.getZoom();
            if (zoom < 13) {
                this.dia = this.diameter * zoom/24;
            }
            else {
                this.dia = this.diameter;
            }
            this.updateMarkerIcon(this.createIcon());
        });
    }

    createIcon() {
        // define default pie sizes
        let width  = this.dia,
            height = this.diameter,
            radius = Math.min(width, height) / 2,
            stroke = Math.min(width * 0.1, 11);

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
            .innerRadius(radius - stroke);

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

        return icon;
    }

    createMarker(icon:any) {
        // append marker to map
        this.marker = L.marker([this.centerLat, this.centerLon], {icon: icon}).addTo(this.rfcxMapComp.rfcxMap);
    }

    updateMarkerIcon(icon:any) {
        this.marker.setIcon(icon);
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

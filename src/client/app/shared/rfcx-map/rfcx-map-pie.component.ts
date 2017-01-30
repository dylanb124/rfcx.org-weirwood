import { Component, Input, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import * as L from 'leaflet';
import * as d3 from 'd3';

let iconSize: any = [20, 28];

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-pie',
  template: ''
})
export class RfcxMapPieComponent implements OnInit, OnDestroy {

  @Input() centerLat: number;
  @Input() centerLon: number;
  @Input() diameter: number;
  @Input() data: Array<any>;
  @Input() colors: any;
  @Input() shortname: string;
  private rfcxMapComp: any;
  private marker: any;
  private dia: number;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.formatInputData();
    this.dia = this.diameter;
    this.bindMapEvents();
    this.createMarker(this.createIcon());
    this.createPopup();
  }

  ngOnDestroy() {
    this.rfcxMapComp.rfcxMap.removeLayer(this.marker);
  }

  formatInputData() {
    let arr = [];
    for (let key in this.data) {
      arr.push({
        label: key,
        count: this.data[key]
      });
    }
    this.data = arr;
  }

  bindMapEvents() {
    this.rfcxMapComp.rfcxMap.on('zoomend', () => {
      this.checkZoomLevel();
      this.updateMarkerIcon(this.createIcon());
    });
  }

  checkZoomLevel() {
    let zoom = this.rfcxMapComp.rfcxMap.getZoom();
    if (zoom < 13) {
      this.dia = this.diameter * zoom / 24;
      this.dia = Math.max(this.dia, 40);
    }
    else {
      this.dia = this.diameter;
    }
  }

  createIcon() {
    let self = this;

    this.checkZoomLevel();
    // define default pie sizes
    let width = this.dia,
      height = this.dia,
      radius = Math.min(width, height) / 2,
      stroke = Math.min(width * 0.1, 11);

    // create svg element object which we will append to leaflet
    let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // get d3 representation of svg object
    let svg = d3.select(svgEl);

    // define sizes for arcs
    let arc: any = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - stroke);

    // define method for pie creation
    let pie = d3.pie()
      .sort(null)
      .value((d: any) => { return d.count; });

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
      .style('fill', (d: any): any => { return self.colors[d.data.label]; });

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

  createMarker(icon: any) {
    // append marker to map
    this.marker = L.marker([this.centerLat, this.centerLon], { icon: icon }).addTo(this.rfcxMapComp.rfcxMap);
  }

  generatePopupHtml() {
    let html = '<p class=\"d3-tip__row d3-tip__row_date\">' + this.shortname + '</p>';
    this.data.forEach((item) => {
      html += '<p class=\"d3-tip__row\">' + item.count + ' ' + item.label + '</p>';
    });
    return html;
  }

  createPopup() {
    let popup = L.popup({ className: 'd3-tip n' })
      .setLatLng([this.centerLat, this.centerLon])
      .setContent(this.generatePopupHtml());
    this.marker.bindPopup(popup);
    this.marker.on('mouseover', function () {
      this.openPopup();
    });
    this.marker.on('mouseout', function () {
      this.closePopup();
    });
  }

  updateMarkerIcon(icon: any) {
    this.marker.setIcon(icon);
  }

  // serialize svg
  serializeXmlNode(xmlNode: any) {
    if (typeof (window as any).XMLSerializer !== 'undefined') {
      return (new (window as any).XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml !== 'undefined') {
      return xmlNode.xml;
    }
    return '';
  }

}

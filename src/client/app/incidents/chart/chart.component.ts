import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'incidents-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncidentsChartComponent implements OnInit {

    // @Input() private data: Array<any>;
    private svgEl: any;
    private svg: any;
    private svgG: any;
    private x: any;
    private y: any;
    private margin: any;
    private width: number;
    private height: number;
    private xAxis: any;
    private yAxis: any;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.prepareD3Chart();
        this.createD3Chart(this.generateData());
    }

    generateData() {
        let data: Array<any> = [];
        for(var i = 0; i < 5; i++) {
            data.push({
                date: '0' + i + ' Feb',
                vehicles: Math.round(Math.random() * 100),
                shots: Math.round(Math.random() * 100),
                chainsaws: Math.round(Math.random() * 100)
            })
        }
        return data;
    }

    prepareD3Chart() {
        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 20
        };
        this.height = 160 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleBand();

        this.y = d3.scaleLinear()
                   .range([this.height, 0]);

        this.xAxis = d3.axisBottom(this.x)
                        .tickSizeInner(0)
                        .tickSizeOuter(0);

        this.yAxis = d3.axisLeft(this.y)
                       .ticks(5)
                       .tickSizeInner(0);

        // create svg element object which we will append to leaflet
        this.svgEl = this.elementRef.nativeElement.getElementsByTagName('svg')[0];

        // get d3 representation of svg object
        this.svg = d3.select(this.svgEl)
                     .attr('height', this.height + this.margin.top + this.margin.bottom);
    }

    createD3Chart(data: any) {
        let parentWidth = jQuery(this.elementRef.nativeElement).width();

        this.width = parentWidth - this.margin.left - this.margin.right;

        this.x.rangeRound([0, this.width])
              .padding(0.3);

        this.yAxis.tickSize(-this.width);

        this.svg.selectAll("*").remove();

        // get d3 representation of svg object
        this.svg.attr('width', this.width + this.margin.left + this.margin.right)

        this.svgG = this.svg
               .append('g')
               .attr('class', 'graph')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x.domain(data.map(function(d:any) { return d.date; }));
        this.y.domain([0, d3.max(data, (d:any) => {
            return d3.max([d.vehicles, d.shots, d.chainsaws]);
        })]);

        this.svgG.append('g')
           .attr('class', 'x axis')
           .attr('transform', 'translate(0,' + this.height + ')')
           .call(this.xAxis);

        this.svgG.append('g')
            .attr('class', 'y axis axis-left')
            .call(this.yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Events');

        let bars = this.svgG.selectAll('.bar').data(data).enter();

        bars.append('rect')
            .attr('class', 'bar bar1')
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', (d:any) => { return this.x(d.date) + this.x.bandwidth()/2 - 36; })
            .attr('width', 24)
            .attr('y', (d:any) => { return this.y(d.vehicles); })
            .attr('height', (d:any) => { return this.height - this.y(d.vehicles); });

        bars.append('rect')
            .attr('class', 'bar bar2')
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', (d:any) => { return this.x(d.date) + this.x.bandwidth()/2 - 12; })
            .attr('width', 24)
            .attr('y', (d:any) => { return this.y(d.shots); })
            .attr('height', (d:any) => { return this.height - this.y(d.shots); });

        bars.append('rect')
            .attr('class', 'bar bar3')
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', (d:any) => { return this.x(d.date) + this.x.bandwidth()/2 + 12; })
            .attr('width', 24)
            .attr('y', (d:any) => { return this.y(d.chainsaws); })
            .attr('height', (d:any) => { return this.height - this.y(d.chainsaws); });
    };

}

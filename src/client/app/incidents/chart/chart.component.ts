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
    private x: any;
    private y: any;
    private margin: any;
    private width: number;
    private height: number;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        let data = [
            { date: '21 Feb', vehicles: 42, shots: 35, chainsaws: 30 },
            { date: '23 Feb', vehicles: 20, shots: 10, chainsaws: 50 },
            { date: '26 Feb', vehicles: 2, shots: 55, chainsaws: 60 },
            { date: '29 Feb', vehicles: 21, shots: 65, chainsaws: 70 },
            { date: '01 Mar', vehicles: 50, shots: 44, chainsaws: 2 }
        ];
        this.createD3Chart(data);
    }

    createD3Chart(data: any) {
        let parentWidth = jQuery(this.elementRef.nativeElement).width();

        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 20
        };

        this.width = parentWidth - this.margin.left - this.margin.right;
        this.height = 160 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleBand()
                  .rangeRound([0, this.width])
                  .padding(0.3);

        this.y = d3.scaleLinear()
                   .range([this.height, 0]);

        let xAxis = d3.axisBottom(this.x)
                      .tickSizeInner(0)
                      .tickSizeOuter(0);
        let yAxisLeft = d3.axisLeft(this.y)
                          .ticks(5)
                          .tickSizeInner(0)
                          .tickSize(-this.width);


        // create svg element object which we will append to leaflet
        this.svgEl = this.elementRef.nativeElement.getElementsByTagName('svg')[0];
        // get d3 representation of svg object
        this.svg = d3.select(this.svgEl)
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
               .append('g')
               .attr('class', 'graph')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x.domain(data.map(function(d:any) { return d.date; }));
        this.y.domain([0, d3.max(data, (d:any) => {
            return d3.max([d.vehicles, d.shots, d.chainsaws]);
        })]);

        this.svg.append('g')
           .attr('class', 'x axis')
           .attr('transform', 'translate(0,' + this.height + ')')
           .call(xAxis);

        this.svg.append('g')
            .attr('class', 'y axis axis-left')
            .call(yAxisLeft)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Events');

        let bars = this.svg.selectAll('.bar').data(data).enter();

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

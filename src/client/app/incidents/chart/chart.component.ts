import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import * as d3Tip from "d3-tip";
import * as moment from 'moment';
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'incidents-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class IncidentsChartComponent implements OnInit {

    // @Input() private data: Array<any>;
    private data: Array<any>;
    private labels: Array<string>;
    private svgEl: any;
    private svg: any;
    private svgG: any;
    private tip: any;
    private x: any;
    private y: any;
    private margin: any;
    private width: number;
    private height: number;
    private xAxis: any;
    private yAxis: any;
    private resizeTimeout: any;

    private formatTipDate = d3.timeFormat('%B %e, %Y');

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.data = this.generateData();
        this.labels = this.getAllLabels(this.data);
        this.prepareD3Chart();
        this.renderD3Chart(this.data);
    }

    onResize(event: any) {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.renderD3Chart(this.data);
        }, 500);
    }

    generateData() {
        let data: Array<any> = [];
        for(var i = 1; i <= 8; i++) {
            data.push({
                date: moment(new Date('2016-02-01T00:00:00.000Z')).add(i, 'day').toDate(),
                events: {
                    vehicles: Math.round(Math.random() * 100) || 20,
                    shots: Math.round(Math.random() * 100) || 20,
                    chainsaws: Math.round(Math.random() * 100) || 20,
                    chainsawss: Math.round(Math.random() * 100) || 20,
                    chainsawsss: Math.round(Math.random() * 100) || 20,
                    chainsawssss: Math.round(Math.random() * 100) || 20,
                    chainsawsssss: Math.round(Math.random() * 100) || 20,
                    someother: Math.round(Math.random() * 100) || 20,
                    someotherr: Math.round(Math.random() * 100) || 20,
                    someotherrr: Math.round(Math.random() * 100) || 20
                }
            })
        }
        return data;
    }

    getAllLabels(data: Array<any>) {
        let events: Array<string> = [];
        data.forEach((item) => {
            Object.keys(item.events).forEach((event) => {
                if (events.indexOf(event) === -1) {
                    events.push(event);
                }
            })
        });
        return events;
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
                        .tickFormat(d3.timeFormat('%b %e'))
                        // .tickSizeInner(0)
                        // .tickSizeOuter(0);

        this.yAxis = d3.axisLeft(this.y)
                       .ticks(5)
                       .tickSizeInner(0);

        // create svg element object which we will append to leaflet
        this.svgEl = this.elementRef.nativeElement.getElementsByTagName('svg')[0];

        // get d3 representation of svg object
        this.svg = d3.select(this.svgEl)
                     .attr('height', this.height + this.margin.top + this.margin.bottom);
    }

    calculateXTicks() {
        let ticks: Array<Date> = [];
        let minDate = d3.min(this.data, (d:any) => {
            return d.date;
        });
        let count = this.data.length;
        let part = count/4;
        for (let i = 0; i < 4; i++) {
            ticks.push(moment(new Date('2016-02-01T00:00:00.000Z')).add(i * part + Math.floor((part+1)/2), 'day').toDate());
        }
        return ticks;
    }

    renderD3Chart(data: Array<any>) {
        let parentWidth = jQuery(this.elementRef.nativeElement).width();

        this.width = parentWidth - this.margin.left - this.margin.right;

        this.x.rangeRound([0, this.width])
              .padding(0.3);

        if (data.length > 15) {
            this.xAxis.tickValues(this.calculateXTicks());
        }

        this.yAxis.tickSize(-this.width);

        this.svg.selectAll("*").remove();

        // get d3 representation of svg object
        this.svg.attr('width', this.width + this.margin.left + this.margin.right)

        this.svgG = this.svg
               .append('g')
               .attr('class', 'graph')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x.domain(data.map((d:any) => { return d.date; }));
        this.y.domain([0, d3.max(data, (d:any) => {
            return d3.max(Object.values(d.events));
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

        this.tip = d3Tip()
                    .attr('class', 'd3-tip')
                    .offset([-8, 0])
                    .html((d:any) => {
                        let html = '<p class="d3-tip__row d3-tip__row_date">' + this.formatTipDate(d.date) + '</p>';
                        for (let label in d.events) {
                            html += '<p class="d3-tip__row">' + d.events[label] + ' ' + label + '</p>';
                        }
                        return html;
                    });

        this.svgG.call(this.tip);

        let bars = this.svgG.selectAll('.bar').data(data).enter();

        let index = 0;
        let count = this.labels.length;
        let barWidth = 24;
        if (data.length > 7) {
            barWidth = 16;
        }
        if (data.length > 14) {
            barWidth = 8;
        }
        this.labels.forEach((label) => {

            let offset = -(count - (count/2 + index)) * barWidth;
            let internalOffset = 0;
            if (data.length > 7 || count > 3) {
                internalOffset = -(index * (barWidth/2)) + count/2 * (barWidth/2);
            }

            bars.append('rect')
                .attr('class', 'bar bar' + index)
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('x', (d:any) => { return this.x(d.date) + this.x.bandwidth()/2 + offset + internalOffset; })
                .attr('width', barWidth)
                .attr('y', (d:any) => { return this.y(d.events[label]); })
                .attr('height', (d:any) => { return this.height - this.y(d.events[label]); })
                .on('mouseover', this.tip.show)
                .on('mouseout', this.tip.hide);

            index++;
        });

    };

}

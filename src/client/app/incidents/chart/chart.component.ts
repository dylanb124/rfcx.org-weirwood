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
    private x1: any;
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
        for(var i = 1; i <= 5; i++) {
            data.push({
                date: moment(new Date('2016-02-01T00:00:00.000Z')).add(i, 'day').toDate(),
                events: {
                    vehicles: Math.round(Math.random() * 100) || 20,
                    shots: Math.round(Math.random() * 100) || 20,
                    chainsaws: Math.round(Math.random() * 100) || 20,
                    monkeys: Math.round(Math.random() * 100) || 20,
                    parrots: Math.round(Math.random() * 100) || 20,
                    birds: Math.round(Math.random() * 100) || 20,
                    elephants: Math.round(Math.random() * 100) || 20,
                    dogs: Math.round(Math.random() * 100) || 20,
                    gsm: Math.round(Math.random() * 100) || 20,
                    aliens: Math.round(Math.random() * 100) || 20
                },
                colors: {
                    vehicles: 'rgba(34, 176, 163, 1)',
                    shots: 'rgba(240, 65, 84, 1)',
                    chainsaws: 'rgba(245, 166, 35, 1)',
                    monkeys: 'rgba(145, 10, 120, 1)',
                    parrots: 'rgba(45, 110, 120, 1)',
                    birds: 'rgba(255, 250, 120, 1)',
                    elephants: 'rgba(25, 250, 120, 1)',
                    dogs: 'rgba(25, 25, 12, 1)',
                    gsm: 'rgba(255, 205, 100, 1)',
                    aliens: 'rgba(80, 80, 100, 1)'
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
        this.x1 = d3.scaleBand();

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
        let self = this;

        let parentWidth = jQuery(this.elementRef.nativeElement).width();

        this.width = parentWidth - this.margin.left - this.margin.right;

        this.x.rangeRound([0, this.width])
              .padding(0.1);

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
        this.x1.domain(this.labels);
        this.y.domain([0, d3.max(data, (d:any) => {
            return d3.max(Object.values(d.events));
        })]);

        this.x1.rangeRound([0, this.x.bandwidth()]);

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

        this.svg.call(this.tip);

        let barGroup = this.svgG.selectAll('.bar-group').data(data).enter()
            .append('g')
            .attr('class', 'bar-group')
            .attr('label', (d:any) => { return d; })
            .attr("transform", (d:any) => { return "translate(" + this.x(d.date) + ",0)"; })
            .on('mouseover', function(d:any) {
                self.tip.show(d, this);
            })
            .on('mouseout', this.tip.hide);

        let count = this.labels.length;

        barGroup.selectAll("rect")
            .data((d:any) => {
                let arr = this.labels.map((label) => {
                    return {
                        name: label,
                        value: d.events[label],
                        color: d.colors[label]
                    }
                })
                return arr;
            })
            .enter()
            .append("rect")
            .attr('class', 'bar')
            .attr('width', this.x1.bandwidth())
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", (d:any, i:any) => {
                let internalOffset = 0;
                if (this.labels.length > 3 || data.length > 5) {
                    internalOffset = -(i * (this.x1.bandwidth()/2)) + count/2 * (this.x1.bandwidth()/2)
                }
                return this.x1(d.name) + internalOffset;
            })
            .attr("y", (d:any) => { return this.y(d.value); })
            .attr('height', (d:any) => { return this.height - this.y(d.value); })
            .style("fill", (d:any) => { return d.color; });

    };

}

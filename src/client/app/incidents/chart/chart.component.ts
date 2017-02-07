import { Component, OnInit, OnChanges, ElementRef, ViewEncapsulation, Input } from '@angular/core';

let jQuery: any = (window as any)['$'];
import * as d3 from 'd3';
import * as d3tip from 'd3-tip';
import * as moment from 'moment';
// way to ignore d3Tip compiler error
let d3Tip: any = d3tip;

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
export class IncidentsChartComponent implements OnInit, OnChanges {

  @Input() data: Array<any>;
  @Input() colors: any;
  public labels: Array<string>;
  public margin: any;
  public height: number;
  public x: any;
  public x1: any;
  public y: any;
  public xAxis: any;
  public yAxis: any;
  public svgEl: any;
  public svg: any;
  public width: number;
  public tip: any;
  private svgG: any;
  private isTipOpened: boolean = false;
  private resizeTimeout: any;
  private zeroValueHeight: number = 3;
  private formatTipDate = d3.timeFormat('%B %e, %Y');

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.checkRequiredParams();
    this.labels = this.getAllLabels(this.data);
    this.prepareD3Chart();
    this.renderD3Chart(this.data);
  }

  checkRequiredParams() {
    if (this.data === undefined) throw new Error('"data" input is required');
    if (this.colors === undefined) throw new Error('"colors" input is required');
  }

  onResize(event: any) {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.renderD3Chart(this.data);
      this.toggleTipVisibility(false);
    }, 500);
  }

  getAllLabels(data: Array<any>) {
    let events: Array<string> = [];
    data.forEach((item) => {
      Object.keys(item.events).forEach((event) => {
        if (events.indexOf(event) === -1) {
          events.push(event);
        }
      });
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
      .tickSizeInner(16)
      .tickSizeOuter(0);

    this.yAxis = d3.axisLeft(this.y)
      .tickFormat(d3.format('d'))
      .tickSizeInner(0);

    // create svg element object which we will append to leaflet
    this.svgEl = this.elementRef.nativeElement.getElementsByTagName('svg')[0];

    // get d3 representation of svg object
    this.svg = d3.select(this.svgEl)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-8, 0])
      .html((d: any) => {
        let html = '<p class=\"d3-tip__row d3-tip__row_date\">' + this.formatTipDate(d.date) + '</p>';
        for (let label in d.events) {
          html += '<p class=\"d3-tip__row\">' + d.events[label] + ' ' + label + '</p>';
        }
        return html;
      });
  }

  calculateXTicks() {
    let ticks: Array<Date> = [];
    let count = this.data.length;
    let part = count / 4;
    let minDate = d3.min(this.data, (d: any) => {
      return d.date;
    });
    for (let i = 0; i < 4; i++) {
      ticks.push(moment(minDate).add(i * part + Math.floor((part + 1) / 2), 'day').toDate());
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

    let yMax = d3.max(data, (d: any) => {
      return d3.max(Object.values(d.events));
    });

    this.yAxis
      .ticks(yMax > 5 ? 5 : yMax)
      .tickSize(-this.width);

    this.svg.selectAll('*').remove();

    // get d3 representation of svg object
    this.svg.attr('width', this.width + this.margin.left + this.margin.right);

    this.svgG = this.svg
      .append('g')
      .attr('class', 'graph')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x.domain(data.map((d: any) => { return d.date; }));
    this.x1.domain(this.labels);
    this.y.domain([0, yMax]);

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

    this.svg.call(this.tip);

    let barGroup = this.svgG.selectAll('.bar-group').data(data).enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: any) => { return 'translate(' + this.x(d.date) + ',0)'; })
      .on('click', function (d: any) {
        if (jQuery(window).width() > 1024) {
          return;
        }
        self.toggleTipVisibility(!self.isTipOpened, d, this);
      })
      .on('mouseover', function (d: any) {
        if (jQuery(window).width() < 1025) {
          return;
        }
        self.highlightBarGroup(this);
        self.toggleTipVisibility(true, d, this);
      })
      .on('mouseout', () => {
        this.resetBarGroupsHighlight();
        self.toggleTipVisibility(false);
      });

    let count = this.labels.length;
    let bandWidth = this.x1.bandwidth();
    let currentWidth = 0;

    barGroup.selectAll('rect')
      .data((d: any) => {
        let arr = this.labels.map((label) => {
          return {
            name: label,
            value: d.events[label],
            color: this.colors[label]
          };
        });
        return arr;
      })
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', (d: any) => {
        // set maximum bar width to 24px
        // this code will choose width based on calculated value from d3 and our max width
        // if d3 width is greater then set to 24
        // if d3 width is smaller than 24, then use d3 value
        // tricky trick!
        currentWidth = Math.min(bandWidth, 24);
        return currentWidth;
      })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', (d: any, i: any) => {
        // calculate difference between band width and our current bar width (might be zero)
        let widDiff = bandWidth - currentWidth;
        // offset bar inside its band if its witdh is smaller than band width
        let offset = (count / 2 - i) * widDiff;
        let internalOffset = 0;
        // offset bars between each other if there are two many labels or two many bar groups
        if (this.labels.length > 3 || data.length > 5) {
          internalOffset = -(i * (currentWidth / 2)) + count / 2 * (currentWidth / 2);
        }
        return this.x1(d.name) + offset + internalOffset;
      })
      // set height to 0, so we can animate from bottom to top
      // if we don't do this, then animation will work from top to bottom
      .attr('height', 0)
      // set y to chart height (bottom of the chart), so we can animate from bottom to top (see previous comment)
      .attr('y', () => {
        return this.height;
      })
      // fill color before animation, so color will not be transitioned
      .style('fill', (d: any) => { return d.color; })
      .transition()
      .duration(1000)
      // create a delay for bars inside groups, so they don't animate all at one time
      .delay((d: any, i: any) => {
        return i * 250;
      })
      .attr('y', (d: any) => {
        if (d.value === 0) {
          return this.height - this.zeroValueHeight;
        }
        return this.y(d.value);
      })
      .attr('height', (d: any) => {
        if (d.value === 0) {
          return this.zeroValueHeight;
        }
        return this.height - this.y(d.value);
      });
  };

  highlightBarGroup(el: any) {
    this.svgG.selectAll('.bar-group')
      .filter(function () {
        return this !== el;
      })
      .attr('class', 'bar-group transparented');
  }

  resetBarGroupsHighlight() {
    this.svgG.selectAll('.bar-group').attr('class', 'bar-group');
  }

  toggleTipVisibility(toShow: boolean, data?: any, target?: any) {
    if (toShow) {
      this.tip.show(data, target);
    }
    else {
      this.tip.hide();
    }
    this.isTipOpened = toShow;
  }

  ngOnChanges(changes: any) {
    if (changes.data && !changes.data.isFirstChange()) {
      this.data = changes.data.currentValue;
      this.labels = this.getAllLabels(this.data);
      this.renderD3Chart(this.data);
      this.toggleTipVisibility(false);
    }
  }

}

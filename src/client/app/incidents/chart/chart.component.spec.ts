import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { IncidentsChartComponent } from './chart.component';

export function main() {

  describe('Incidents Chart Component', () => {

    let comp: IncidentsChartComponent;
    let fixture: ComponentFixture<IncidentsChartComponent>;
    let expectedData: Array<any>;

    const initialData = [
      { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
      { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
    ];

    const colors = {
      vehicle: 'rgba(34, 176, 163, 1)',
      shot: 'rgba(240, 65, 84, 1)',
      chainsaw: 'rgba(245, 166, 35, 1)'
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [IncidentsChartComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(IncidentsChartComponent);
      comp = fixture.componentInstance;
      expectedData = initialData.slice(0);
      comp.data = expectedData;
      comp.colors = colors;
      fixture.detectChanges();
    });

    describe('collecting all labels from data', () => {
      beforeEach(() => {
        expectedData = initialData.slice(0);
        fixture.detectChanges();
      });

      it('should collect chainsaw, shot and vehicle', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.labels.sort()).toEqual(['chainsaw', 'shot', 'vehicle']);
          });
      });

      it('should collect chainsaw, monkey, shot and vehicle', () => {
        expectedData = [
          { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, monkey: 2 } },
          { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
        ];
        fixture = TestBed.createComponent(IncidentsChartComponent);
        comp = fixture.componentInstance;
        comp.data = expectedData;
        comp.colors = colors;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.labels.sort()).toEqual(['chainsaw', 'monkey', 'shot', 'vehicle']);
          });
      });

      it('should not collect any labels', () => {
        // remove all events from data
        expectedData = [
          { 'date': '2017-01-14T21:00:00.000Z', 'events': {} },
          { 'date': '2017-01-15T21:00:00.000Z', 'events': {} },
          { 'date': '2017-01-16T21:00:00.000Z', 'events': {} },
          { 'date': '2017-01-17T21:00:00.000Z', 'events': {} },
          { 'date': '2017-01-18T21:00:00.000Z', 'events': {} }
        ];
        fixture = TestBed.createComponent(IncidentsChartComponent);
        comp = fixture.componentInstance;
        comp.data = expectedData;
        comp.colors = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.labels).toEqual([]);
          });
      });
    });

    describe('preparing params and objects for d3 chart', () => {

      beforeEach(() => {
        expectedData = initialData.slice(0);
        fixture.detectChanges();
      });

      it('should set top, right and left margins to 20 and bottom to 30', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.margin.top).toEqual(20);
            expect(comp.margin.right).toEqual(20);
            expect(comp.margin.bottom).toEqual(30);
            expect(comp.margin.left).toEqual(20);
          });
      });

      it('should set height to 110', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.height).toEqual(110);
          });
      });

      it('should setup x, x1 band scales, y linear scale, x and y axises', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.x).toBeTruthy();
            expect(comp.x1).toBeTruthy();
            expect(comp.y).toBeTruthy();
            expect(comp.xAxis).toBeTruthy();
            expect(comp.yAxis).toBeTruthy();
          });
      });

      it('should find svg html element in template', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.svgEl.tagName).toEqual('svg');
          });
      });

      it('should set svg height to 160', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.svg.attr('height')).toEqual('160');
          });
      });

      it('should set svg width to 1264', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.svg.attr('width')).toEqual('1264');
          });
      });

      it('should create d3 tip object', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.tip).toBeTruthy();
            expect(comp.tip.attr('class')).toEqual('d3-tip');
          });
      });

    });

    describe('calculateXTicks function', () => {

      it('should create d3 tip object', () => {
        expectedData = [
          { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
          { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
          { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } }
        ];
        fixture = TestBed.createComponent(IncidentsChartComponent);
        comp = fixture.componentInstance;
        comp.data = expectedData;
        comp.colors = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let ticks = comp.calculateXTicks();
            expect(ticks[0].toISOString()).toEqual('2017-01-16T21:00:00.000Z');
            expect(ticks[1].toISOString()).toEqual('2017-01-20T21:00:00.000Z');
            expect(ticks[2].toISOString()).toEqual('2017-01-24T21:00:00.000Z');
            expect(ticks[3].toISOString()).toEqual('2017-01-28T21:00:00.000Z');
          });
      });

      it('should create d3 tip object', () => {
        expectedData = [
          { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
          { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
          { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
          { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 0, 'chainsaw': 1 } },
          { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-30T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } },
          { 'date': '2017-01-31T21:00:00.000Z', 'events': { 'vehicle': 2, 'shot': 1, 'chainsaw': 1 } }
        ];
        fixture = TestBed.createComponent(IncidentsChartComponent);
        comp = fixture.componentInstance;
        comp.data = expectedData;
        comp.colors = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let ticks = comp.calculateXTicks();
            expect(ticks[0].toISOString()).toEqual('2017-01-16T21:00:00.000Z');
            expect(ticks[1].toISOString()).toEqual('2017-01-21T21:00:00.000Z');
            expect(ticks[2].toISOString()).toEqual('2017-01-25T21:00:00.000Z');
            expect(ticks[3].toISOString()).toEqual('2017-01-30T21:00:00.000Z');
          });
      });

    });

    describe('rendering d3 chart', () => {

      describe('x axis', () => {

        beforeEach(() => {
          expectedData = initialData.slice(0);
          fixture.detectChanges();
        });

        it('should create 5 ticks', () => {
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(5);
            });
        });

        it('should create 1 tick', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(1);
            });
        });

        it('should create 3 ticks', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(3);
            });
        });

        it('should create 7 ticks', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(7);
            });
        });

        it('should create 15 ticks', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(15);
            });
        });

        it('should create 4 ticks if data length is greater then 15 (currently 16)', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(4);
            });
        });

        it('should create 4 ticks if data length is greater then 15 (currently 30)', () => {
          expectedData = [
            { 'date': '2017-01-09T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-10T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-11T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-12T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-13T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-30T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-31T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-01T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-02T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-03T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-04T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-05T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-06T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-07T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              expect(comp.svgEl.querySelectorAll('.axis.x .tick').length).toEqual(4);
            });
        });

      });

      describe('x axis', () => {

        beforeEach(() => {
          expectedData = initialData.slice(0);
          fixture.detectChanges();
        });

        it('should create 3 ticks: 0, 1 and 2', () => {
          TestBed
            .compileComponents()
            .then(() => {
              let ticks = comp.svgEl.querySelectorAll('.axis.y .tick');
              expect(ticks.length).toEqual(3);
              expect(ticks[0].querySelector('text').textContent).toEqual('0');
              expect(ticks[1].querySelector('text').textContent).toEqual('1');
              expect(ticks[2].querySelector('text').textContent).toEqual('2');
            });
        });

        it('should create 4 ticks: 0, 1, 2, 3', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 3, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let ticks = comp.svgEl.querySelectorAll('.axis.y .tick');
              expect(ticks.length).toEqual(4);
              expect(ticks[0].querySelector('text').textContent).toEqual('0');
              expect(ticks[1].querySelector('text').textContent).toEqual('1');
              expect(ticks[2].querySelector('text').textContent).toEqual('2');
              expect(ticks[3].querySelector('text').textContent).toEqual('3');
            });
        });

        it('should create 5 ticks: 0, 1, 2, 3, 4', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 4, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let ticks = comp.svgEl.querySelectorAll('.axis.y .tick');
              expect(ticks.length).toEqual(5);
              expect(ticks[0].querySelector('text').textContent).toEqual('0');
              expect(ticks[1].querySelector('text').textContent).toEqual('1');
              expect(ticks[2].querySelector('text').textContent).toEqual('2');
              expect(ticks[3].querySelector('text').textContent).toEqual('3');
              expect(ticks[4].querySelector('text').textContent).toEqual('4');
            });
        });

        it('should create 7 ticks: 0, 5, 10, 15, 20', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 20, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let ticks = comp.svgEl.querySelectorAll('.axis.y .tick');
              expect(ticks.length).toEqual(5);
              expect(ticks[0].querySelector('text').textContent).toEqual('0');
              expect(ticks[1].querySelector('text').textContent).toEqual('5');
              expect(ticks[2].querySelector('text').textContent).toEqual('10');
              expect(ticks[3].querySelector('text').textContent).toEqual('15');
              expect(ticks[4].querySelector('text').textContent).toEqual('20');
            });
        });

      });

      describe('bars', () => {

        beforeEach(() => {
          expectedData = initialData.slice(0);
          fixture.detectChanges();
        });

        it('should create 5 bar groups with 3s bar inside each one', () => {
          TestBed
            .compileComponents()
            .then(() => {
              let barGroups = comp.svgEl.querySelectorAll('.bar-group');
              expect(barGroups.length).toEqual(5);
              expect(barGroups[0].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[1].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[2].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[3].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[4].querySelectorAll('.bar').length).toEqual(3);
            });
        });

        it('should set bars widths to 24px', () => {
          TestBed
            .compileComponents()
            .then(() => {
              let bars = comp.svgEl.querySelectorAll('.bar-group .bar');
              let widthTrue = true;
              bars.forEach((item: any) => {
                if (item.getAttribute('width') !== '24') {
                  widthTrue = false;
                }
              });
              expect(widthTrue).toEqual(true);
            });
        });

        it('should create 1 bar group with 3 bars inside', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let barGroups = comp.svgEl.querySelectorAll('.bar-group');
              expect(barGroups.length).toEqual(1);
              expect(barGroups[0].querySelectorAll('.bar').length).toEqual(3);
            });
        });

        it('should create 3 bar groups with 4 bars inside each one', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, monkey: 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let barGroups = comp.svgEl.querySelectorAll('.bar-group');
              expect(barGroups.length).toEqual(3);
              expect(barGroups[0].querySelectorAll('.bar').length).toEqual(4);
              expect(barGroups[1].querySelectorAll('.bar').length).toEqual(4);
              expect(barGroups[2].querySelectorAll('.bar').length).toEqual(4);
            });
        });

        it('should create 7 bar groups with 3 bars inside each one', () => {
          expectedData = [
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let barGroups = comp.svgEl.querySelectorAll('.bar-group');
              expect(barGroups.length).toEqual(7);
              expect(barGroups[0].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[1].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[2].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[3].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[4].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[5].querySelectorAll('.bar').length).toEqual(3);
              expect(barGroups[6].querySelectorAll('.bar').length).toEqual(3);
            });
        });

        it('should create 30 bar groups with 10 bars inside each one', () => {
          expectedData = [
            { 'date': '2017-01-09T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'monkey': 2 } },
            { 'date': '2017-01-10T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'elephant': 2 } },
            { 'date': '2017-01-11T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'penguin': 2 } },
            { 'date': '2017-01-12T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'owl': 3 } },
            { 'date': '2017-01-13T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'alien': 1 } },
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'dog': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0, 'bear': 3 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-30T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-31T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-01T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-02T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-03T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-04T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-05T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-06T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-07T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let barGroups = comp.svgEl.querySelectorAll('.bar-group');
              expect(barGroups.length).toEqual(30);
              expect(barGroups[0].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[1].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[2].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[3].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[4].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[5].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[6].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[7].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[8].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[9].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[10].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[11].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[12].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[13].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[14].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[15].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[16].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[17].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[18].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[19].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[20].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[21].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[22].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[23].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[24].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[25].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[26].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[27].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[28].querySelectorAll('.bar').length).toEqual(10);
              expect(barGroups[29].querySelectorAll('.bar').length).toEqual(10);
            });
        });

        it('should set bars widths to less then 24px - what d3 will calculate inside it', () => {
          expectedData = [
            { 'date': '2017-01-09T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'monkey': 2 } },
            { 'date': '2017-01-10T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'elephant': 2 } },
            { 'date': '2017-01-11T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'penguin': 2 } },
            { 'date': '2017-01-12T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'owl': 3 } },
            { 'date': '2017-01-13T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'alien': 1 } },
            { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2, 'dog': 2 } },
            { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0, 'bear': 3 } },
            { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-19T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-20T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-21T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
            { 'date': '2017-01-22T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-23T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-24T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-25T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-26T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-27T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-28T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 0, 'chainsaw': 0 } },
            { 'date': '2017-01-29T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-30T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-01-31T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-01T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-02T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-03T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-04T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-05T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-06T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } },
            { 'date': '2017-02-07T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 1, 'chainsaw': 0 } }
          ];
          fixture = TestBed.createComponent(IncidentsChartComponent);
          comp = fixture.componentInstance;
          comp.data = expectedData;
          comp.colors = expectedData;
          fixture.detectChanges();
          TestBed
            .compileComponents()
            .then(() => {
              let bars = comp.svgEl.querySelectorAll('.bar-group .bar');
              let widthTrue = true;
              bars.forEach((item: any) => {
                if (parseInt(item.getAttribute('width')) >= 24) {
                  widthTrue = false;
                }
              });
              expect(widthTrue).toEqual(true);
            });
        });

      });

    });

  });

}

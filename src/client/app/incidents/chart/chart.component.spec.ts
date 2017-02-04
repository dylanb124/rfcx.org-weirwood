import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { IncidentsChartComponent } from './chart.component';

export function main() {

  describe('Incidents Chart Component', () => {

    let comp: IncidentsChartComponent;
    let fixture: ComponentFixture<IncidentsChartComponent>;
    let expectedData: Array<any>;

    const initialData = [
      {
        'date': '2017-01-14T21:00:00.000Z',
        'events': {
            'vehicle': 1,
            'shot': 2,
            'chainsaw': 2
        }
      }, {
        'date': '2017-01-15T21:00:00.000Z',
        'events': {
            'vehicle': 0,
            'shot': 0,
            'chainsaw': 0
        }
      }, {
        'date': '2017-01-16T21:00:00.000Z',
        'events': {
            'vehicle': 0,
            'shot': 0,
            'chainsaw': 0
        }
      }, {
        'date': '2017-01-17T21:00:00.000Z',
        'events': {
            'vehicle': 0,
            'shot': 0,
            'chainsaw': 0
        }
      }, {
        'date': '2017-01-18T21:00:00.000Z',
        'events': {
            'vehicle': 0,
            'shot': 0,
            'chainsaw': 0
        }
      }
    ];

    const colors = {
      vehicle: 'rgba(34, 176, 163, 1)',
      shot: 'rgba(240, 65, 84, 1)',
      chainsaw: 'rgba(245, 166, 35, 1)'
    };

    // const initialBigData = [
    // ];

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
        expectedData[0].events.monkey = 2;
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
          {
            'guid': '12d2bffb10c4',
            'shortname': 'Jaguar Road',
            'coords': { 'lat': -3.17294, 'lon': -46.9855 },
            'events': {},
            'eventsCount': 2,
            'diameter': 80
          }, {
            'guid': '3b10826702df',
            'shortname': 'Itahu',
            'coords': { 'lat': -2.14298, 'lon': -46.9155 },
            'events': {},
            'eventsCount': 3,
            'diameter': 150
          }
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

  });

}

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { IncidentsChartComponent } from './chart.component';

export function main() {

  describe('Incidents Chart Component', () => {

    let comp: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let expectedData: Array<any>;
    let de: DebugElement;
    let el: HTMLElement;

    const initialData = [
      { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 2 } },
      { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } }
    ];

    const changedData = [
      { 'date': '2017-01-14T21:00:00.000Z', 'events': { 'vehicle': 5, 'shot': 4, 'chainsaw': 3 } },
      { 'date': '2017-01-15T21:00:00.000Z', 'events': { 'vehicle': 6, 'shot': 7, 'chainsaw': 8 } },
      { 'date': '2017-01-16T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-17T21:00:00.000Z', 'events': { 'vehicle': 0, 'shot': 0, 'chainsaw': 0 } },
      { 'date': '2017-01-18T21:00:00.000Z', 'events': { 'vehicle': 9, 'shot': 10, 'chainsaw': 11 } }
    ];

    const colors = {
      vehicle: 'rgba(34, 176, 163, 1)',
      shot: 'rgba(240, 65, 84, 1)',
      chainsaw: 'rgba(245, 166, 35, 1)'
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [IncidentsChartComponent, TestHostComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      comp = fixture.componentInstance;
      expectedData = initialData.slice(0);
      comp.incidents = expectedData;
      comp.colors = colors;
      fixture.detectChanges();
      el = fixture.nativeElement;
      de = fixture.debugElement;
    });

    it('should update chart with new data after ngOnChanges event on data', () => {
      TestBed
        .compileComponents()
        .then(() => {
          let barGroups = el.querySelectorAll('.incidents-chart__svg .bar-group');
          expect(barGroups[0].querySelectorAll('.bar')[0].getAttribute('data-value')).toEqual('1');
          expect(barGroups[0].querySelectorAll('.bar')[1].getAttribute('data-value')).toEqual('2');
          expect(barGroups[0].querySelectorAll('.bar')[2].getAttribute('data-value')).toEqual('2');
          expectedData = changedData.slice(0);
          comp.incidents = expectedData;
          fixture.detectChanges();
          expect(barGroups[0].querySelectorAll('.bar')[0].getAttribute('data-value')).toEqual('5');
          expect(barGroups[0].querySelectorAll('.bar')[1].getAttribute('data-value')).toEqual('4');
          expect(barGroups[0].querySelectorAll('.bar')[2].getAttribute('data-value')).toEqual('3');
        });
    });

  });

  @Component({
    template: '<incidents-chart [data]="incidents" [colors]="colors"></incidents-chart>'
  })
  class TestHostComponent {
    incidents: Array<any>;
    colors: any;
  }

}

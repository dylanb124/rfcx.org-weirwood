import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { IncidentsTableComponent } from './table.component';

describe('Incidents Table Component', () => {

  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let expectedData: Array<any>;
  let de: DebugElement
  let el: HTMLElement;

  const initialData = [
    {
      'guid': '12d2bffb10c4',
      'shortname': 'Jaguar Road',
      'coords': { 'lat': -3.17294, 'lon': -46.9855 },
      'events': { 'chainsaw': 2, 'vehicle': 0, 'shot': 0 },
      'eventsCount': 2,
      'diameter': 80
    }, {
      'guid': '3b10826702df',
      'shortname': 'Itahu',
      'coords': { 'lat': -2.14298, 'lon': -46.9155 },
      'events': { 'vehicle': 1, 'shot': 2, 'chainsaw': 0 },
      'eventsCount': 3,
      'diameter': 150
    }
  ];

  const changedData = [
    {
      'guid': '12d2bffb10c4',
      'shortname': 'Jaguar Road',
      'coords': { 'lat': -3.17294, 'lon': -46.9855 },
      'events': { 'chainsaw': 3, 'vehicle': 8, 'shot': 12 },
      'eventsCount': 23,
      'diameter': 80
    }, {
      'guid': '3b10826702df',
      'shortname': 'Itahu',
      'coords': { 'lat': -2.14298, 'lon': -46.9155 },
      'events': { 'vehicle': 2, 'shot': 3, 'chainsaw': 2 },
      'eventsCount': 7,
      'diameter': 150
    }
  ];

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncidentsTableComponent, TestHostComponent],
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    comp = fixture.componentInstance;
    expectedData = initialData.slice(0);
    comp.incidents = expectedData;
    fixture.detectChanges();
    el = fixture.nativeElement;
    de = fixture.debugElement;
  });

  it('should recalcualte events per guardians after data input change', () => {
    TestBed
      .compileComponents()
      .then(() => {
        expect(el.querySelectorAll('tbody td.table-rfcx__col_last')[0].innerHTML).toBe('2');
        expect(el.querySelectorAll('tbody td.table-rfcx__col_last')[1].innerHTML).toBe('3');
        expect(el.querySelector('tfoot td.table-rfcx__col_last').innerHTML).toBe('5');
        expectedData = changedData.slice(0);
        comp.incidents = expectedData;
        fixture.detectChanges();
        expect(el.querySelectorAll('tbody td.table-rfcx__col_last')[0].innerHTML).toBe('23');
        expect(el.querySelectorAll('tbody td.table-rfcx__col_last')[1].innerHTML).toBe('7');
        expect(el.querySelector('tfoot td.table-rfcx__col_last').innerHTML).toBe('30');
      });
  });

  it('should recalcualte events per labels after data input change', () => {
    TestBed
      .compileComponents()
      .then(() => {
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="chainsaw"]').innerHTML).toBe('2');
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="shot"]').innerHTML).toBe('2');
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="vehicle"]').innerHTML).toBe('1');
        expectedData = changedData.slice(0);
        comp.incidents = expectedData;
        fixture.detectChanges();
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="chainsaw"]').innerHTML).toBe('5');
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="shot"]').innerHTML).toBe('15');
        expect(el.querySelector('tfoot td.table-rfcx__col[data-label="vehicle"]').innerHTML).toBe('10');
      });
  });

});

@Component({
  template: '<incidents-table [data]="incidents"></incidents-table>'
})
class TestHostComponent {
  incidents: Array<any>;
}

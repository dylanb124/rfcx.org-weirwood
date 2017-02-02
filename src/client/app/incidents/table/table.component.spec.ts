// import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { IncidentsTableComponent } from './table.component';

describe('Incidents Table Component', () => {

  let comp: IncidentsTableComponent;
  let fixture: ComponentFixture<IncidentsTableComponent>;
  // let de: DebugElement
  // let el: HTMLElement;
  let expectedData: Array<any>;

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

  const initialBigData = [
    {
      'guid': '12d2bffb10c4',
      'shortname': 'Jaguar Road',
      'coords': { 'lat': -3.17294, 'lon': -46.9855 },
      'events': { 'chainsaw': 0, 'vehicle': 0, 'shot': 0 },
      'eventsCount': 2,
      'diameter': 80
    }, {
      'guid': '3b10826702df',
      'shortname': 'Itahu',
      'coords': { 'lat': -2.14298, 'lon': -46.9155 },
      'events': { 'vehicle': 500 },
      'eventsCount': 3,
      'diameter': 150
    }, {
      'guid': '3b10826702df',
      'shortname': 'Itahu',
      'coords': { 'lat': -2.14298, 'lon': -46.9155 },
      'events': { 'vehicle': 99999990, 'shot': 5, 'chainsaw': 4 },
      'eventsCount': 3,
      'diameter': 150
    }
  ];

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncidentsTableComponent],
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsTableComponent);
    comp = fixture.componentInstance;
    expectedData = initialData.slice(0);
    comp.data = expectedData;
    fixture.detectChanges();
  });

  describe('should collect all labels from data', () => {
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
      expectedData.push({
        'guid': '3b10826702dj',
        'shortname': 'Itahu',
        'coords': { 'lat': -2.14298, 'lon': -46.9155 },
        'events': { 'vehicle': 1, 'monkey': 2, 'chainsaw': 0 },
        'eventsCount': 3,
        'diameter': 150
      });
      fixture = TestBed.createComponent(IncidentsTableComponent);
      comp = fixture.componentInstance;
      comp.data = expectedData;
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
      fixture = TestBed.createComponent(IncidentsTableComponent);
      comp = fixture.componentInstance;
      comp.data = expectedData;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.labels).toEqual([]);
        });
    });
  });

  describe('should calculate total events count for each guardian', () => {
    beforeEach(() => {
      expectedData = initialData.slice(0);
      fixture.detectChanges();
    });

    it('should set total to 2 and 3', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.data[0].total).toEqual(2);
          expect(comp.data[1].total).toEqual(3);
        });
    });

    it('should set total to 0, 500 and 99999999', () => {
      expectedData = initialBigData.slice(0);
      fixture = TestBed.createComponent(IncidentsTableComponent);
      comp = fixture.componentInstance;
      comp.data = expectedData;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.data[0].total).toEqual(0);
          expect(comp.data[1].total).toEqual(500);
          expect(comp.data[2].total).toEqual(99999999);
        });
    });

    it('should set total to 0', () => {
      expectedData = [
        {
          'guid': '12d2bffb10c4',
          'shortname': 'Jaguar Road',
          'coords': { 'lat': -3.17294, 'lon': -46.9855 },
          'events': {},
          'eventsCount': 2,
          'diameter': 80
        }
      ];
      fixture = TestBed.createComponent(IncidentsTableComponent);
      comp = fixture.componentInstance;
      comp.data = expectedData;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.data[0].total).toEqual(0);
        });
    });

  });

  describe('should calculate total events count per label', () => {
    beforeEach(() => {
      expectedData = initialData.slice(0);
      fixture.detectChanges();
    });

    it('should calcualte 2 chainsaws, 1 vehicle, 2 shots and 5 total', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.labelsTotal['chainsaw']).toEqual(2);
          expect(comp.labelsTotal['shot']).toEqual(2);
          expect(comp.labelsTotal['vehicle']).toEqual(1);
          expect(comp.labelsTotal['total']).toEqual(5);
        });
    });

    it('should calcualte 4 chainsaws, 100000490 vehicles, 5 shots and 100000499 total', () => {
      expectedData = initialBigData.slice(0);
      fixture = TestBed.createComponent(IncidentsTableComponent);
      comp = fixture.componentInstance;
      comp.data = expectedData;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.labelsTotal['chainsaw']).toEqual(4);
          expect(comp.labelsTotal['shot']).toEqual(5);
          expect(comp.labelsTotal['vehicle']).toEqual(100000490);
          expect(comp.labelsTotal['total']).toEqual(100000499);
        });
    });
  });

});

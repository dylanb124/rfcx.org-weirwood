import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Http, Headers, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { MockConnection } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/core';

import { IncidentsComponent } from './incidents.component';
import { UserService } from '../shared/user/user.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { DropdownCheckboxesComponent } from '../shared/dropdown-checkboxes/dropdown-checkboxes.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { IncidentsDateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { RfcxMapComponent, RfcxBaseMapComponent, RfcxMapMarkerComponent, RfcxMapPieComponent } from '../shared/rfcx-map/index';
import { IncidentsChartComponent } from './chart/chart.component';
import { IncidentsTableComponent } from './table/table.component';
import { FooterComponent } from '../shared/footer/footer.component';

let jQuery: any = (window as any)['$'];

export function main() {

  describe('Incidents Component', () => {

    let comp: IncidentsComponent;
    let fixture: ComponentFixture<IncidentsComponent>;
    let expectedData: Array<any>;

    let mockUser = {
      logIn: () => {
        return {
          subscribe: (success: Function, error: Function) => {
            success();
          }
        };
      }
    };
    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          IncidentsComponent,
          SpinnerComponent,
          DropdownCheckboxesComponent,
          DropdownComponent,
          IncidentsDateTimePickerComponent,
          RfcxMapComponent,
          RfcxBaseMapComponent,
          RfcxMapMarkerComponent,
          RfcxMapPieComponent,
          IncidentsChartComponent,
          IncidentsTableComponent,
          FooterComponent
        ],
        providers: [
          { provide: UserService, useValue: mockUser },
          {
            provide: Http, useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
              return new Http(mockBackend, options);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          MockBackend,
          BaseRequestOptions,
          CookieService
        ]
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(IncidentsComponent);
      comp = fixture.componentInstance;
      spyOn(comp, 'ngOnInit').and.callFake(() => { return; });
      fixture.detectChanges();
    });

    it('should initialize component variables and call intializeFilterValues and loadData', () => {
      fixture = TestBed.createComponent(IncidentsComponent);
      comp = fixture.componentInstance;
      let spyFilt = spyOn(comp, 'intializeFilterValues').and.callFake(() => { return; });
      let spyLoad = spyOn(comp, 'loadData').and.callFake(() => { return; });
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.incidentTypes[0]).toEqual({ value: 'vehicle', label: 'Vehicles', checked: true });
          expect(comp.incidentTypes[1]).toEqual({ value: 'shot', label: 'Shots', checked: true });
          expect(comp.incidentTypes[2]).toEqual({ value: 'chainsaw', label: 'Chainsaws', checked: true });
          expect(comp.daysCount[0]).toEqual({ value: 1, label: '1 Day' });
          expect(comp.daysCount[1]).toEqual({ value: 3, label: '3 Days' });
          expect(comp.daysCount[2]).toEqual({ value: 5, label: '5 Days', selected: true });
          expect(comp.daysCount[3]).toEqual({ value: 7, label: '7 Days' });
          expect(comp.daysCount[4]).toEqual({ value: 30, label: '30 Days' });
          expect(comp.formats[0]).toEqual({ value: 'csv_dates', label: 'csv grouped by dates' });
          expect(comp.formats[1]).toEqual({ value: 'csv_guardians', label: 'csv grouped by guardians' });
          expect(comp.colors.vehicle).toEqual('rgba(34, 176, 163, 1)');
          expect(comp.colors.shot).toEqual('rgba(240, 65, 84, 1)');
          expect(comp.colors.chainsaw).toEqual('rgba(245, 166, 35, 1)');
          expect(comp.mapDetails.zoom).toEqual(10);
          expect(comp.minCircleDiameter).toEqual(80);
          expect(comp.maxCircleDiameter).toEqual(150);
          let today = new Date();
          expect('' + comp.maxDate.getDate() + comp.maxDate.getMonth() + comp.maxDate.getFullYear())
            .toEqual('' + today.getDate() + today.getMonth() + today.getFullYear());
          expect(comp.currentDaysCount).toEqual(5);
          expect(comp.mobileFiltersOpened).toEqual(false);
          expect(comp.isLoading).toEqual(false);
          expect(spyFilt.calls.count()).toEqual(1);
          expect(spyLoad.calls.count()).toEqual(1);
          expect(spyLoad.calls.first().args[0]).toEqual({initial: true});
        });
    });

    it('should set currentDate, call recalculateDates, refreshTimeBounds and set currentIncidentTypeValues to result of ' +
        'getCheckedIncidentTypeValues call on intializeFilterValues call', () => {
      fixture = TestBed.createComponent(IncidentsComponent);
      comp = fixture.componentInstance;
      spyOn(comp, 'loadData').and.callFake(() => { return; });
      let spyFilter = spyOn(comp, 'intializeFilterValues').and.callFake(() => { return; });
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          spyFilter.and.callThrough();
          let spyRecalc = spyOn(comp, 'recalculateDates').and.returnValue(true);
          let spyRefr = spyOn(comp, 'refreshTimeBounds').and.returnValue(true);
          let spyGet = spyOn(comp, 'getCheckedIncidentTypeValues').and.returnValue({aa: 'bb'});
          let date = new Date();
          date.setDate(date.getDate() - comp.currentDaysCount);
          comp.intializeFilterValues();
          expect('' + comp.currentDate.getDate() + comp.currentDate.getMonth() + comp.currentDate.getFullYear())
            .toEqual('' + date.getDate() + date.getMonth() + date.getFullYear());
          expect(spyRecalc.calls.count()).toEqual(1);
          expect(spyRefr.calls.count()).toEqual(1);
          expect(spyGet.calls.count()).toEqual(1);
          expect(comp.currentIncidentTypeValues).toEqual({aa: 'bb'});
        });
    });

    describe('loadData method', () => {

      let mockByGuardObs, mockByDatesObs;

      beforeEach(() => {
        mockByGuardObs = {
          subscribe: (success: Function, error: Function) => { success(); }
        };
        mockByDatesObs = {
          subscribe: (success: Function, error: Function) => { success(); }
        };
      });

      it('should call getDataByGuardians one time and getDataByDates two times with correct params', () => {
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        comp.currentdateStartingAfter = '12345';
        comp.currentdateEndingBefore = '67890';
        TestBed
          .compileComponents()
          .then(() => {
            let spyByGuard = spyOn(comp, 'getDataByGuardians');
            let spyByDates = spyOn(comp, 'getDataByDates');
            comp.loadData({ initial: true });
            expect(spyByGuard.calls.count()).toEqual(1);
            expect(spyByDates.calls.count()).toEqual(2);
            expect(spyByDates.calls.allArgs()).toEqual([
              [{
                starting_after: '12345',
                ending_before: '67890',
                values: ['aaa', 'bbb', 'ccc']
              }],
              [{
                url: 'events/stats/year',
                values: ['aaa', 'bbb', 'ccc']
              }]
            ]);
          });
      });

      it('should call getDataByGuardians getDataByDates one time (if initial param not set) with correct params', () => {
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        comp.currentdateStartingAfter = '12345';
        comp.currentdateEndingBefore = '67890';
        TestBed
          .compileComponents()
          .then(() => {
            let spyByGuard = spyOn(comp, 'getDataByGuardians');
            let spyByDates = spyOn(comp, 'getDataByDates');
            comp.loadData();
            expect(spyByGuard.calls.count()).toEqual(1);
            expect(spyByDates.calls.count()).toEqual(1);
            expect(spyByDates.calls.allArgs()).toEqual([
              [{
                starting_after: '12345',
                ending_before: '67890',
                values: ['aaa', 'bbb', 'ccc']
              }]
            ]);
          });
      });

      describe('response', () => {

        let spyObserv;

        beforeAll(() => {
          comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
          comp.currentdateStartingAfter = '12345';
          comp.currentdateEndingBefore = '67890';
          spyObserv = spyOn(Observable, 'forkJoin').and.callFake(() => {
            return {
              subscribe: (success: Function, error: Function) => {
                success([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
              }
            };
          });
          fixture.detectChanges();
        });

        it('should call onDataByGuardians and onDataByDates with proper attributes', () => {
          TestBed
            .compileComponents()
            .then(() => {
              spyOn(comp, 'getDataByGuardians').and.returnValue(true);
              spyOn(comp, 'getDataByDates').and.returnValue(true);
              let spyByGuard = spyOn(comp, 'onDataByGuardians').and.returnValue(true);
              let spyByDates = spyOn(comp, 'onDataByDates').and.returnValue(true);
              fixture.detectChanges();
              comp.loadData();
              expect(spyByGuard.calls.count()).toEqual(1);
              expect(spyByGuard.calls.first().args[0]).toEqual([1, 2, 3]);
              expect(spyByDates.calls.count()).toEqual(1);
              expect(spyByDates.calls.first().args[0]).toEqual([4, 5, 6]);
            });
        });

        it('should call onDataByGuardians, onDataByDates, onDataByYears and checkInitialLoadedData with proper attributes', () => {
          TestBed
            .compileComponents()
            .then(() => {
              spyOn(comp, 'getDataByGuardians').and.returnValue(true);
              spyOn(comp, 'getDataByDates').and.returnValue(true);
              let spyByGuard = spyOn(comp, 'onDataByGuardians').and.returnValue(true);
              let spyByDates = spyOn(comp, 'onDataByDates').and.returnValue(true);
              let spyByYears = spyOn(comp, 'onDataByYears').and.returnValue(true);
              let spyCheck = spyOn(comp, 'checkInitialLoadedData').and.returnValue(true);
              comp.loadData({ initial: true });
              expect(spyByGuard.calls.count()).toEqual(1);
              expect(spyByGuard.calls.first().args[0]).toEqual([1, 2, 3]);
              expect(spyByDates.calls.count()).toEqual(1);
              expect(spyByDates.calls.first().args[0]).toEqual([4, 5, 6]);
              expect(spyByYears.calls.count()).toEqual(1);
              expect(spyByYears.calls.first().args[0]).toEqual([7, 8, 9]);
              expect(spyCheck.calls.count()).toEqual(1);
            });
        });

      });

    });

    describe('getCheckedIncidentTypeValues function', () => {

      it('should return ["vehicle", shot", "chainsaw"] on getCheckedIncidentTypeValues', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.getCheckedIncidentTypeValues();
            expect(res).toEqual(['vehicle', 'shot', 'chainsaw']);
          });
      });

      it('should return ["shot", "chainsaw"] on getCheckedIncidentTypeValues', () => {
        comp.incidentTypes = [
          { value: 'vehicle', label: 'Vehicles', checked: false },
          { value: 'shot', label: 'Shots', checked: true },
          { value: 'chainsaw', label: 'Chainsaws', checked: true }
        ];
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.getCheckedIncidentTypeValues();
            expect(res).toEqual(['shot', 'chainsaw']);
          });
      });

      it('should return empty array on getCheckedIncidentTypeValues', () => {
        comp.incidentTypes = [
          { value: 'vehicle', label: 'Vehicles', checked: false },
          { value: 'shot', label: 'Shots', checked: false },
          { value: 'chainsaw', label: 'Chainsaws', checked: false }
        ];
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.getCheckedIncidentTypeValues();
            expect(res).toEqual([]);
          });
      });

    });

    describe('getDataByGuardians', () => {

      beforeEach(() => {
        comp.currentdateStartingAfter = 'abcdef';
        comp.currentdateEndingBefore = 'fedcba';
        comp.currentIncidentTypeValues = ['111', '222', '333'];
        spyOn(comp.cookieService, 'get').and.callFake((attr: string) => {
          if (attr === 'guid') {
            return '123456';
          }
          if (attr === 'token') {
            return '654321';
          }
          return attr;
        });
      });

      it('should get data by guardians',
        inject([MockBackend], (mockBackend: MockBackend) => {

        const mockResponse = [{
          aaa: 'bbb'
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
          expect(connection.request.headers.get('x-auth-user')).toEqual('user/123456');
          expect(connection.request.headers.get('x-auth-token')).toEqual('654321');
          let url = connection.request.url;
          let expUrl = 'events/stats/guardian?starting_after=abcdef&ending_before=fedcba&values=111&values=222&values=333';
          expect(url.indexOf(expUrl, url.length - expUrl.length)).not.toEqual(-1);
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        let req = comp.getDataByGuardians();
        req.subscribe((res: any) => {
          expect(res).toEqual([{aaa: 'bbb'}]);
        });

      }));

      it('should get another data by guardians',
        inject([MockBackend], (mockBackend: MockBackend) => {

        comp.currentIncidentTypeValues = [];
        const mockResponse = [{
          ccc: 'ddd'
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
          expect(connection.request.headers.get('x-auth-user')).toEqual('user/123456');
          expect(connection.request.headers.get('x-auth-token')).toEqual('654321');
          let url = connection.request.url;
          let expUrl = 'events/stats/guardian?starting_after=abcdef&ending_before=fedcba';
          expect(url.indexOf(expUrl, url.length - expUrl.length)).not.toEqual(-1);
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });
        let req = comp.getDataByGuardians();
        req.subscribe((res: any) => {
          expect(res).toEqual([{ccc: 'ddd'}]);
        });

      }));

    });

    it('should set incidents to result of parseIncidentsByGuardians call, then call getInitialMapCenter, ' +
      'countIncidents and calculateDiameters on onDataByGuardians call', () => {
      let spyParse = spyOn(comp, 'parseIncidentsByGuardians').and.returnValue(['qwerty']);
      let spyCenter = spyOn(comp, 'getInitialMapCenter').and.returnValue(true);
      let spyCount = spyOn(comp, 'countIncidents').and.returnValue(true);
      let spyCalc = spyOn(comp, 'calculateDiameters').and.returnValue(true);
      TestBed
        .compileComponents()
        .then(() => {
          comp.onDataByGuardians({aaa: 'bbb'});
          expect(comp.incidents).toEqual(['qwerty']);
          expect(spyParse.calls.count()).toEqual(1);
          expect(spyParse.calls.first().args[0]).toEqual({aaa: 'bbb'});
          expect(spyCenter.calls.count()).toEqual(1);
          expect(spyCount.calls.count()).toEqual(1);
          expect(spyCalc.calls.count()).toEqual(1);
        });
    });

    describe('getDataByDates method', () => {

      beforeEach(() => {
        spyOn(comp.cookieService, 'get').and.callFake((attr: string) => {
          if (attr === 'guid') {
            return '123456';
          }
          if (attr === 'token') {
            return '654321';
          }
          return attr;
        });
      });

      it('should get data by dates',
        inject([MockBackend], (mockBackend: MockBackend) => {

        const mockResponse = [{
          aaa: 'bbb'
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
          expect(connection.request.headers.get('x-auth-user')).toEqual('user/123456');
          expect(connection.request.headers.get('x-auth-token')).toEqual('654321');
          let url = connection.request.url;
          let expUrl = 'events/stats/dates?starting_after=111&ending_before=222&values=aaa&values=bbb&values=ccc';
          expect(url.indexOf(expUrl, url.length - expUrl.length)).not.toEqual(-1);
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        let req = comp.getDataByDates({
          starting_after: 111,
          ending_before: 222,
          values: ['aaa', 'bbb', 'ccc']
        });
        req.subscribe((res: any) => {
          expect(res).toEqual([{aaa: 'bbb'}]);
        });

      }));

      it('should get another data by dates',
        inject([MockBackend], (mockBackend: MockBackend) => {

        const mockResponse = [{
          ccc: 'ddd'
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
          expect(connection.request.headers.get('x-auth-user')).toEqual('user/123456');
          expect(connection.request.headers.get('x-auth-token')).toEqual('654321');
          let url = connection.request.url;
          let expUrl = 'events/stats/dates';
          expect(url.indexOf(expUrl, url.length - expUrl.length)).not.toEqual(-1);
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        let req = comp.getDataByDates({});
        req.subscribe((res: any) => {
          expect(res).toEqual([{ccc: 'ddd'}]);
        });

      }));

    });

    it('should set incidentsByDates to result of parseIncidentsByDates call on onDataByDates call', () => {
      let spyParse = spyOn(comp, 'parseIncidentsByDates').and.returnValue(['qwerty']);
      TestBed
        .compileComponents()
        .then(() => {
          comp.onDataByDates({aaa: 'bbb'});
          expect(comp.incidentsByDates).toEqual(['qwerty']);
          expect(spyParse.calls.count()).toEqual(1);
          expect(spyParse.calls.first().args[0]).toEqual({aaa: 'bbb'});
        });
    });

    it('should set incidentsByYear to result of parseIncidentsByYear call on onDataByYears call', () => {
      let spyParse = spyOn(comp, 'parseIncidentsByYear').and.returnValue(['qwerty']);
      TestBed
        .compileComponents()
        .then(() => {
          comp.onDataByYears({aaa: 'bbb'});
          expect(comp.incidentsByYear).toEqual(['qwerty']);
          expect(spyParse.calls.count()).toEqual(1);
          expect(spyParse.calls.first().args[0]).toEqual({aaa: 'bbb'});
        });
    });

    describe('getInitialMapCenter function', () => {

      it('should set mapDetails.lat and mapDetails.lon to default values 37.773972 and -122.431297 on ' +
        'getInitialMapCenter call', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.getInitialMapCenter();
            expect(comp.mapDetails.lat).toEqual(37.773972);
            expect(comp.mapDetails.lon).toEqual(-122.431297);
          });
      });

      it('should set mapDetails.lat and mapDetails.lon to first incidents item on getInitialMapCenter call', () => {
        comp.incidents = [
          { coords: { lat: 1111.1111, lon: 2222.2222 } }
        ];
        TestBed
        .compileComponents()
        .then(() => {
          comp.getInitialMapCenter();
          expect(comp.mapDetails.lat).toEqual(1111.1111);
          expect(comp.mapDetails.lon).toEqual(2222.2222);
        });
      });

      it('should set mapDetails.lat and mapDetails.lon to another first incidents item on getInitialMapCenter call', () => {
        comp.incidents = [
          { coords: { lat: 3333.4444, lon: 5555.6666 } },
          { coords: { lat: 1111.1111, lon: 2222.2222 } }
        ];
        TestBed
          .compileComponents()
          .then(() => {
            comp.getInitialMapCenter();
            expect(comp.mapDetails.lat).toEqual(3333.4444);
            expect(comp.mapDetails.lon).toEqual(5555.6666);
          });
      });

    });

    describe('countIncidents function', () => {

      it('should count 10 and 20 events for array items and set them to eventsCount property', () => {
        comp.incidents = [
          { events: { a: 2, b: 5, c: 3 } },
          { events: { a: 12, b: 2, c: 6 } }
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.countIncidents();
            expect(comp.incidents[0].eventsCount).toEqual(10);
            expect(comp.incidents[1].eventsCount).toEqual(20);
          });
      });

      it('should count 0, 30, 50 and 1 events for array items and set them to eventsCount property', () => {
        comp.incidents = [
          { events: { } },
          { events: { a: 15, b: 1, c: 1, d: 2, e: 5, f: 6 } },
          { events: { a: 30, b: 20 } },
          { events: { b: 1 } }
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.countIncidents();
            expect(comp.incidents[0].eventsCount).toEqual(0);
            expect(comp.incidents[1].eventsCount).toEqual(30);
            expect(comp.incidents[2].eventsCount).toEqual(50);
            expect(comp.incidents[3].eventsCount).toEqual(1);
          });
      });

    });

    describe('calculateDiameters function', () => {

      it('should set diameters to 80, 133 and 150', () => {
        comp.incidents = [
          { eventsCount: 10, events: {} },
          { eventsCount: 30, events: {} },
          { eventsCount: 50, events: {} },
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.calculateDiameters();
            expect(comp.incidents[0].diameter).toEqual(80);
            expect(comp.incidents[1].diameter).toEqual(133);
            expect(comp.incidents[2].diameter).toEqual(150);
          });
      });

      it('should set diameters to 80 and 150', () => {
        comp.incidents = [
          { eventsCount: 10, events: {} },
          { eventsCount: 50, events: {} },
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.calculateDiameters();
            expect(comp.incidents[0].diameter).toEqual(80);
            expect(comp.incidents[1].diameter).toEqual(150);
          });
      });

      it('should set diameters to 80, 82, 87, 90 and 150', () => {
        comp.incidents = [
          { eventsCount: 10, events: {} },
          { eventsCount: 12, events: {} },
          { eventsCount: 32, events: {} },
          { eventsCount: 50, events: {} },
          { eventsCount: 350, events: {} },
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.calculateDiameters();
            expect(comp.incidents[0].diameter).toEqual(80);
            expect(comp.incidents[1].diameter).toEqual(82);
            expect(comp.incidents[2].diameter).toEqual(87);
            expect(comp.incidents[3].diameter).toEqual(90);
            expect(comp.incidents[4].diameter).toEqual(150);
          });
      });

    });

    describe('recalculateDates function', () => {

      let date = new Date();

      beforeEach(() => {
        jasmine.clock().mockDate(date);
      });

      it('should set maxDate to current time if currentDaysCount is 0', () => {
        comp.currentDaysCount = 0;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.recalculateDates();
            expect(comp.maxDate.getTime()).toEqual(date.getTime());
          });
      });

      it('should set maxDate to current time if currentDaysCount is 1', () => {
        comp.currentDaysCount = 1;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.recalculateDates();
            expect(comp.maxDate.getTime()).toEqual(date.getTime());
          });
      });

      it('should set maxDate to current time minus 2 days if currentDaysCount is 2', () => {
        comp.currentDaysCount = 2;
        let expDate = new Date();
        expDate.setDate(expDate.getDate() - 2);
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.recalculateDates();
            expect(comp.maxDate.getTime()).toEqual(expDate.getTime());
          });
      });

      it('should set maxDate to current time minus 40 days if currentDaysCount is 40', () => {
        comp.currentDaysCount = 40;
        let expDate = new Date();
        expDate.setDate(expDate.getDate() - 40);
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.recalculateDates();
            expect(comp.maxDate.getTime()).toEqual(expDate.getTime());
          });
      });

    });

    describe('refreshTimeBounds function', () => {

      let date = new Date('03/02/2017 10:15:32');

      beforeEach(() => {
        jasmine.clock().mockDate(date);
      });

      it('should set currentdateStartingAfter to 2017-03-02 00:00:00 and currentdateEndingBefore to 2017-03-03 00:00:00', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.currentDate = date;
            comp.currentDaysCount = 1;
            fixture.detectChanges();
            comp.refreshTimeBounds();
            expect(comp.currentdateStartingAfter).toEqual('2017-03-02 00:00:00');
            expect(comp.currentdateEndingBefore).toEqual('2017-03-03 00:00:00');
          });
      });

      it('should set currentdateStartingAfter to 2017-03-02 00:00:00 and currentdateEndingBefore to 2017-03-12 00:00:00', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.currentDate = date;
            comp.currentDaysCount = 10;
            fixture.detectChanges();
            comp.refreshTimeBounds();
            expect(comp.currentdateStartingAfter).toEqual('2017-03-02 00:00:00');
            expect(comp.currentdateEndingBefore).toEqual('2017-03-12 00:00:00');
          });
      });

    });

    describe('parseIncidentsByGuardians function', () => {

      it('should fill empty events with currentIncidentTypeValues with zeroes', () => {
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        let incidents = [
              { events: {} },
              { events: {} },
              { events: {} }
            ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByGuardians(incidents);
            expect(incidents[0].events).toEqual({aaa: 0, bbb: 0, ccc: 0});
            expect(incidents[1].events).toEqual({aaa: 0, bbb: 0, ccc: 0});
            expect(incidents[2].events).toEqual({aaa: 0, bbb: 0, ccc: 0});
            expect(res).toEqual([
              { events: { aaa: 0, bbb: 0, ccc: 0 } },
              { events: { aaa: 0, bbb: 0, ccc: 0 } },
              { events: { aaa: 0, bbb: 0, ccc: 0 } }
            ]);
          });
      });

      it('should fill missing events with currentIncidentTypeValues with zeroes', () => {
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        let incidents = [
              { events: { aaa: 1, bbb: 2 } },
              { events: { aaa: 3 } },
              { events: {} }
            ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByGuardians(incidents);
            expect(incidents[0].events).toEqual({aaa: 1, bbb: 2, ccc: 0});
            expect(incidents[1].events).toEqual({aaa: 3, bbb: 0, ccc: 0});
            expect(incidents[2].events).toEqual({aaa: 0, bbb: 0, ccc: 0});
            expect(res).toEqual([
              { events: { aaa: 1, bbb: 2, ccc: 0 } },
              { events: { aaa: 3, bbb: 0, ccc: 0 } },
              { events: { aaa: 0, bbb: 0, ccc: 0 } }
            ]);
          });
      });

      it('should do nothing if incidents have all currentIncidentTypeValues', () => {
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        let incidents = [
              { events: { aaa: 1, bbb: 2, ccc: 3 } },
              { events: { aaa: 4, bbb: 5, ccc: 6 } },
              { events: { aaa: 7, bbb: 8, ccc: 9 } }
            ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByGuardians(incidents);
            expect(incidents[0].events).toEqual({aaa: 1, bbb: 2, ccc: 3});
            expect(incidents[1].events).toEqual({aaa: 4, bbb: 5, ccc: 6});
            expect(incidents[2].events).toEqual({aaa: 7, bbb: 8, ccc: 9});
            expect(res).toEqual([
              { events: { aaa: 1, bbb: 2, ccc: 3 } },
              { events: { aaa: 4, bbb: 5, ccc: 6 } },
              { events: { aaa: 7, bbb: 8, ccc: 9 } }
            ]);
          });
      });

    });

    describe('parseIncidentsByDates function', () => {

      let date = new Date('03/02/2017');
      let incidents: any;

      beforeEach(() => {

        comp.currentDate = date;
        comp.currentDaysCount = 5;
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        incidents = {
          '03/01/2017': { aaa: 2, bbb: 2, ccc: 2 },
          '03/02/2017': { bbb: 5 },
          '03/03/2017': { ccc: 3 }
        };
        jasmine.clock().mockDate(date);
      });

      it('should return empty array if input object has no attributes', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByDates({});
            expect(res).toEqual([]);
          });
      });

      it('should return array with values for selected dates', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByDates(incidents);
            expect(res).toEqual([
              { date: new Date('03/02/2017'), events: { aaa: 0, bbb: 5, ccc: 0 } },
              { date: new Date('03/03/2017'), events: { aaa: 0, bbb: 0, ccc: 3 } },
              { date: new Date('03/04/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/05/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/06/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } }
            ]);
          });
      });

      it('should return array with another values for selected dates', () => {
        comp.currentDaysCount = 14;
        incidents = {
          '03/01/2017': { aaa: 20, bbb: 2, ccc: 2 },
          '03/02/2017': { bbb: 5, ccc: 5, ddd: 100 },
          '03/03/2017': { ccc: 3 },
          '03/10/2017': { ccc: 13 }
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByDates(incidents);
            expect(res).toEqual([
              { date: new Date('03/02/2017'), events: { aaa: 0, bbb: 5, ccc: 5 } },
              { date: new Date('03/03/2017'), events: { aaa: 0, bbb: 0, ccc: 3 } },
              { date: new Date('03/04/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/05/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/06/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/07/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/08/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/09/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/10/2017'), events: { aaa: 0, bbb: 0, ccc: 13 } },
              { date: new Date('03/11/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/12/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/13/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/14/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } },
              { date: new Date('03/15/2017'), events: { aaa: 0, bbb: 0, ccc: 0 } }
            ]);
          });
      });

    });

    describe('parseIncidentsByYear function', () => {

      let date = new Date('03/02/2017');
      let incidentsObj: any;

      beforeEach(() => {

        comp.currentDate = date;
        comp.currentDaysCount = 5;
        comp.currentIncidentTypeValues = ['aaa', 'bbb', 'ccc'];
        incidentsObj = {
          '03/01/2017': { aaa: 2, bbb: 2, ccc: 2 },
          '03/02/2017': { bbb: 5 },
          '03/03/2017': { ccc: 3 }
        };
        jasmine.clock().mockDate(date);
      });

      it('should return null if input object has no attributes', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByYear({});
            expect(res).toBeNull();
          });
      });

      it('should return object with incidents by last year', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByYear(incidentsObj);
            expect(res).toEqual({
              '03/02/2016': false, '03/03/2016': false, '03/04/2016': false, '03/05/2016': false, '03/06/2016': false, '03/07/2016': false,
              '03/08/2016': false, '03/09/2016': false, '03/10/2016': false, '03/11/2016': false, '03/12/2016': false, '03/13/2016': false,
              '03/14/2016': false, '03/15/2016': false, '03/16/2016': false, '03/17/2016': false, '03/18/2016': false, '03/19/2016': false,
              '03/20/2016': false, '03/21/2016': false, '03/22/2016': false, '03/23/2016': false, '03/24/2016': false, '03/25/2016': false,
              '03/26/2016': false, '03/27/2016': false, '03/28/2016': false, '03/29/2016': false, '03/30/2016': false, '03/31/2016': false,
              '04/01/2016': false, '04/02/2016': false, '04/03/2016': false, '04/04/2016': false, '04/05/2016': false, '04/06/2016': false,
              '04/07/2016': false, '04/08/2016': false, '04/09/2016': false, '04/10/2016': false, '04/11/2016': false, '04/12/2016': false,
              '04/13/2016': false, '04/14/2016': false, '04/15/2016': false, '04/16/2016': false, '04/17/2016': false, '04/18/2016': false,
              '04/19/2016': false, '04/20/2016': false, '04/21/2016': false, '04/22/2016': false, '04/23/2016': false, '04/24/2016': false,
              '04/25/2016': false, '04/26/2016': false, '04/27/2016': false, '04/28/2016': false, '04/29/2016': false, '04/30/2016': false,
              '05/01/2016': false, '05/02/2016': false, '05/03/2016': false, '05/04/2016': false, '05/05/2016': false, '05/06/2016': false,
              '05/07/2016': false, '05/08/2016': false, '05/09/2016': false, '05/10/2016': false, '05/11/2016': false, '05/12/2016': false,
              '05/13/2016': false, '05/14/2016': false, '05/15/2016': false, '05/16/2016': false, '05/17/2016': false, '05/18/2016': false,
              '05/19/2016': false, '05/20/2016': false, '05/21/2016': false, '05/22/2016': false, '05/23/2016': false, '05/24/2016': false,
              '05/25/2016': false, '05/26/2016': false, '05/27/2016': false, '05/28/2016': false, '05/29/2016': false, '05/30/2016': false,
              '05/31/2016': false, '06/01/2016': false, '06/02/2016': false, '06/03/2016': false, '06/04/2016': false, '06/05/2016': false,
              '06/06/2016': false, '06/07/2016': false, '06/08/2016': false, '06/09/2016': false, '06/10/2016': false, '06/11/2016': false,
              '06/12/2016': false, '06/13/2016': false, '06/14/2016': false, '06/15/2016': false, '06/16/2016': false, '06/17/2016': false,
              '06/18/2016': false, '06/19/2016': false, '06/20/2016': false, '06/21/2016': false, '06/22/2016': false, '06/23/2016': false,
              '06/24/2016': false, '06/25/2016': false, '06/26/2016': false, '06/27/2016': false, '06/28/2016': false, '06/29/2016': false,
              '06/30/2016': false, '07/01/2016': false, '07/02/2016': false, '07/03/2016': false, '07/04/2016': false, '07/05/2016': false,
              '07/06/2016': false, '07/07/2016': false, '07/08/2016': false, '07/09/2016': false, '07/10/2016': false, '07/11/2016': false,
              '07/12/2016': false, '07/13/2016': false, '07/14/2016': false, '07/15/2016': false, '07/16/2016': false, '07/17/2016': false,
              '07/18/2016': false, '07/19/2016': false, '07/20/2016': false, '07/21/2016': false, '07/22/2016': false, '07/23/2016': false,
              '07/24/2016': false, '07/25/2016': false, '07/26/2016': false, '07/27/2016': false, '07/28/2016': false, '07/29/2016': false,
              '07/30/2016': false, '07/31/2016': false, '08/01/2016': false, '08/02/2016': false, '08/03/2016': false, '08/04/2016': false,
              '08/05/2016': false, '08/06/2016': false, '08/07/2016': false, '08/08/2016': false, '08/09/2016': false, '08/10/2016': false,
              '08/11/2016': false, '08/12/2016': false, '08/13/2016': false, '08/14/2016': false, '08/15/2016': false, '08/16/2016': false,
              '08/17/2016': false, '08/18/2016': false, '08/19/2016': false, '08/20/2016': false, '08/21/2016': false, '08/22/2016': false,
              '08/23/2016': false, '08/24/2016': false, '08/25/2016': false, '08/26/2016': false, '08/27/2016': false, '08/28/2016': false,
              '08/29/2016': false, '08/30/2016': false, '08/31/2016': false, '09/01/2016': false, '09/02/2016': false, '09/03/2016': false,
              '09/04/2016': false, '09/05/2016': false, '09/06/2016': false, '09/07/2016': false, '09/08/2016': false, '09/09/2016': false,
              '09/10/2016': false, '09/11/2016': false, '09/12/2016': false, '09/13/2016': false, '09/14/2016': false, '09/15/2016': false,
              '09/16/2016': false, '09/17/2016': false, '09/18/2016': false, '09/19/2016': false, '09/20/2016': false, '09/21/2016': false,
              '09/22/2016': false, '09/23/2016': false, '09/24/2016': false, '09/25/2016': false, '09/26/2016': false, '09/27/2016': false,
              '09/28/2016': false, '09/29/2016': false, '09/30/2016': false, '10/01/2016': false, '10/02/2016': false, '10/03/2016': false,
              '10/04/2016': false, '10/05/2016': false, '10/06/2016': false, '10/07/2016': false, '10/08/2016': false, '10/09/2016': false,
              '10/10/2016': false, '10/11/2016': false, '10/12/2016': false, '10/13/2016': false, '10/14/2016': false, '10/15/2016': false,
              '10/16/2016': false, '10/17/2016': false, '10/18/2016': false, '10/19/2016': false, '10/20/2016': false, '10/21/2016': false,
              '10/22/2016': false, '10/23/2016': false, '10/24/2016': false, '10/25/2016': false, '10/26/2016': false, '10/27/2016': false,
              '10/28/2016': false, '10/29/2016': false, '10/30/2016': false, '10/31/2016': false, '11/01/2016': false, '11/02/2016': false,
              '11/03/2016': false, '11/04/2016': false, '11/05/2016': false, '11/06/2016': false, '11/07/2016': false, '11/08/2016': false,
              '11/09/2016': false, '11/10/2016': false, '11/11/2016': false, '11/12/2016': false, '11/13/2016': false, '11/14/2016': false,
              '11/15/2016': false, '11/16/2016': false, '11/17/2016': false, '11/18/2016': false, '11/19/2016': false, '11/20/2016': false,
              '11/21/2016': false, '11/22/2016': false, '11/23/2016': false, '11/24/2016': false, '11/25/2016': false, '11/26/2016': false,
              '11/27/2016': false, '11/28/2016': false, '11/29/2016': false, '11/30/2016': false, '12/01/2016': false, '12/02/2016': false,
              '12/03/2016': false, '12/04/2016': false, '12/05/2016': false, '12/06/2016': false, '12/07/2016': false, '12/08/2016': false,
              '12/09/2016': false, '12/10/2016': false, '12/11/2016': false, '12/12/2016': false, '12/13/2016': false, '12/14/2016': false,
              '12/15/2016': false, '12/16/2016': false, '12/17/2016': false, '12/18/2016': false, '12/19/2016': false, '12/20/2016': false,
              '12/21/2016': false, '12/22/2016': false, '12/23/2016': false, '12/24/2016': false, '12/25/2016': false, '12/26/2016': false,
              '12/27/2016': false, '12/28/2016': false, '12/29/2016': false, '12/30/2016': false, '12/31/2016': false, '01/01/2017': false,
              '01/02/2017': false, '01/03/2017': false, '01/04/2017': false, '01/05/2017': false, '01/06/2017': false, '01/07/2017': false,
              '01/08/2017': false, '01/09/2017': false, '01/10/2017': false, '01/11/2017': false, '01/12/2017': false, '01/13/2017': false,
              '01/14/2017': false, '01/15/2017': false, '01/16/2017': false, '01/17/2017': false, '01/18/2017': false, '01/19/2017': false,
              '01/20/2017': false, '01/21/2017': false, '01/22/2017': false, '01/23/2017': false, '01/24/2017': false, '01/25/2017': false,
              '01/26/2017': false, '01/27/2017': false, '01/28/2017': false, '01/29/2017': false, '01/30/2017': false, '01/31/2017': false,
              '02/01/2017': false, '02/02/2017': false, '02/03/2017': false, '02/04/2017': false, '02/05/2017': false, '02/06/2017': false,
              '02/07/2017': false, '02/08/2017': false, '02/09/2017': false, '02/10/2017': false, '02/11/2017': false, '02/12/2017': false,
              '02/13/2017': false, '02/14/2017': false, '02/15/2017': false, '02/16/2017': false, '02/17/2017': false, '02/18/2017': false,
              '02/19/2017': false, '02/20/2017': false, '02/21/2017': false, '02/22/2017': false, '02/23/2017': false, '02/24/2017': false,
              '02/25/2017': false, '02/26/2017': false, '02/27/2017': false, '02/28/2017': false, '03/01/2017': true, '03/02/2017': true,
              '03/03/2017': true }
            );
          });
      });

      it('should return another object with incidents by last year', () => {
        incidentsObj = {
          '01/01/2017': { aaa: 2 },
          '03/02/2017': { bbb: 5 },
          '03/03/2017': { ccc: 3 },
          '02/13/2017': { ddd: 3 }
        };
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.parseIncidentsByYear(incidentsObj);
            expect(res).toEqual({
              '03/02/2016': false, '03/03/2016': false, '03/04/2016': false, '03/05/2016': false, '03/06/2016': false, '03/07/2016': false,
              '03/08/2016': false, '03/09/2016': false, '03/10/2016': false, '03/11/2016': false, '03/12/2016': false, '03/13/2016': false,
              '03/14/2016': false, '03/15/2016': false, '03/16/2016': false, '03/17/2016': false, '03/18/2016': false, '03/19/2016': false,
              '03/20/2016': false, '03/21/2016': false, '03/22/2016': false, '03/23/2016': false, '03/24/2016': false, '03/25/2016': false,
              '03/26/2016': false, '03/27/2016': false, '03/28/2016': false, '03/29/2016': false, '03/30/2016': false, '03/31/2016': false,
              '04/01/2016': false, '04/02/2016': false, '04/03/2016': false, '04/04/2016': false, '04/05/2016': false, '04/06/2016': false,
              '04/07/2016': false, '04/08/2016': false, '04/09/2016': false, '04/10/2016': false, '04/11/2016': false, '04/12/2016': false,
              '04/13/2016': false, '04/14/2016': false, '04/15/2016': false, '04/16/2016': false, '04/17/2016': false, '04/18/2016': false,
              '04/19/2016': false, '04/20/2016': false, '04/21/2016': false, '04/22/2016': false, '04/23/2016': false, '04/24/2016': false,
              '04/25/2016': false, '04/26/2016': false, '04/27/2016': false, '04/28/2016': false, '04/29/2016': false, '04/30/2016': false,
              '05/01/2016': false, '05/02/2016': false, '05/03/2016': false, '05/04/2016': false, '05/05/2016': false, '05/06/2016': false,
              '05/07/2016': false, '05/08/2016': false, '05/09/2016': false, '05/10/2016': false, '05/11/2016': false, '05/12/2016': false,
              '05/13/2016': false, '05/14/2016': false, '05/15/2016': false, '05/16/2016': false, '05/17/2016': false, '05/18/2016': false,
              '05/19/2016': false, '05/20/2016': false, '05/21/2016': false, '05/22/2016': false, '05/23/2016': false, '05/24/2016': false,
              '05/25/2016': false, '05/26/2016': false, '05/27/2016': false, '05/28/2016': false, '05/29/2016': false, '05/30/2016': false,
              '05/31/2016': false, '06/01/2016': false, '06/02/2016': false, '06/03/2016': false, '06/04/2016': false, '06/05/2016': false,
              '06/06/2016': false, '06/07/2016': false, '06/08/2016': false, '06/09/2016': false, '06/10/2016': false, '06/11/2016': false,
              '06/12/2016': false, '06/13/2016': false, '06/14/2016': false, '06/15/2016': false, '06/16/2016': false, '06/17/2016': false,
              '06/18/2016': false, '06/19/2016': false, '06/20/2016': false, '06/21/2016': false, '06/22/2016': false, '06/23/2016': false,
              '06/24/2016': false, '06/25/2016': false, '06/26/2016': false, '06/27/2016': false, '06/28/2016': false, '06/29/2016': false,
              '06/30/2016': false, '07/01/2016': false, '07/02/2016': false, '07/03/2016': false, '07/04/2016': false, '07/05/2016': false,
              '07/06/2016': false, '07/07/2016': false, '07/08/2016': false, '07/09/2016': false, '07/10/2016': false, '07/11/2016': false,
              '07/12/2016': false, '07/13/2016': false, '07/14/2016': false, '07/15/2016': false, '07/16/2016': false, '07/17/2016': false,
              '07/18/2016': false, '07/19/2016': false, '07/20/2016': false, '07/21/2016': false, '07/22/2016': false, '07/23/2016': false,
              '07/24/2016': false, '07/25/2016': false, '07/26/2016': false, '07/27/2016': false, '07/28/2016': false, '07/29/2016': false,
              '07/30/2016': false, '07/31/2016': false, '08/01/2016': false, '08/02/2016': false, '08/03/2016': false, '08/04/2016': false,
              '08/05/2016': false, '08/06/2016': false, '08/07/2016': false, '08/08/2016': false, '08/09/2016': false, '08/10/2016': false,
              '08/11/2016': false, '08/12/2016': false, '08/13/2016': false, '08/14/2016': false, '08/15/2016': false, '08/16/2016': false,
              '08/17/2016': false, '08/18/2016': false, '08/19/2016': false, '08/20/2016': false, '08/21/2016': false, '08/22/2016': false,
              '08/23/2016': false, '08/24/2016': false, '08/25/2016': false, '08/26/2016': false, '08/27/2016': false, '08/28/2016': false,
              '08/29/2016': false, '08/30/2016': false, '08/31/2016': false, '09/01/2016': false, '09/02/2016': false, '09/03/2016': false,
              '09/04/2016': false, '09/05/2016': false, '09/06/2016': false, '09/07/2016': false, '09/08/2016': false, '09/09/2016': false,
              '09/10/2016': false, '09/11/2016': false, '09/12/2016': false, '09/13/2016': false, '09/14/2016': false, '09/15/2016': false,
              '09/16/2016': false, '09/17/2016': false, '09/18/2016': false, '09/19/2016': false, '09/20/2016': false, '09/21/2016': false,
              '09/22/2016': false, '09/23/2016': false, '09/24/2016': false, '09/25/2016': false, '09/26/2016': false, '09/27/2016': false,
              '09/28/2016': false, '09/29/2016': false, '09/30/2016': false, '10/01/2016': false, '10/02/2016': false, '10/03/2016': false,
              '10/04/2016': false, '10/05/2016': false, '10/06/2016': false, '10/07/2016': false, '10/08/2016': false, '10/09/2016': false,
              '10/10/2016': false, '10/11/2016': false, '10/12/2016': false, '10/13/2016': false, '10/14/2016': false, '10/15/2016': false,
              '10/16/2016': false, '10/17/2016': false, '10/18/2016': false, '10/19/2016': false, '10/20/2016': false, '10/21/2016': false,
              '10/22/2016': false, '10/23/2016': false, '10/24/2016': false, '10/25/2016': false, '10/26/2016': false, '10/27/2016': false,
              '10/28/2016': false, '10/29/2016': false, '10/30/2016': false, '10/31/2016': false, '11/01/2016': false, '11/02/2016': false,
              '11/03/2016': false, '11/04/2016': false, '11/05/2016': false, '11/06/2016': false, '11/07/2016': false, '11/08/2016': false,
              '11/09/2016': false, '11/10/2016': false, '11/11/2016': false, '11/12/2016': false, '11/13/2016': false, '11/14/2016': false,
              '11/15/2016': false, '11/16/2016': false, '11/17/2016': false, '11/18/2016': false, '11/19/2016': false, '11/20/2016': false,
              '11/21/2016': false, '11/22/2016': false, '11/23/2016': false, '11/24/2016': false, '11/25/2016': false, '11/26/2016': false,
              '11/27/2016': false, '11/28/2016': false, '11/29/2016': false, '11/30/2016': false, '12/01/2016': false, '12/02/2016': false,
              '12/03/2016': false, '12/04/2016': false, '12/05/2016': false, '12/06/2016': false, '12/07/2016': false, '12/08/2016': false,
              '12/09/2016': false, '12/10/2016': false, '12/11/2016': false, '12/12/2016': false, '12/13/2016': false, '12/14/2016': false,
              '12/15/2016': false, '12/16/2016': false, '12/17/2016': false, '12/18/2016': false, '12/19/2016': false, '12/20/2016': false,
              '12/21/2016': false, '12/22/2016': false, '12/23/2016': false, '12/24/2016': false, '12/25/2016': false, '12/26/2016': false,
              '12/27/2016': false, '12/28/2016': false, '12/29/2016': false, '12/30/2016': false, '12/31/2016': false, '01/01/2017': true,
              '01/02/2017': false, '01/03/2017': false, '01/04/2017': false, '01/05/2017': false, '01/06/2017': false, '01/07/2017': false,
              '01/08/2017': false, '01/09/2017': false, '01/10/2017': false, '01/11/2017': false, '01/12/2017': false, '01/13/2017': false,
              '01/14/2017': false, '01/15/2017': false, '01/16/2017': false, '01/17/2017': false, '01/18/2017': false, '01/19/2017': false,
              '01/20/2017': false, '01/21/2017': false, '01/22/2017': false, '01/23/2017': false, '01/24/2017': false, '01/25/2017': false,
              '01/26/2017': false, '01/27/2017': false, '01/28/2017': false, '01/29/2017': false, '01/30/2017': false, '01/31/2017': false,
              '02/01/2017': false, '02/02/2017': false, '02/03/2017': false, '02/04/2017': false, '02/05/2017': false, '02/06/2017': false,
              '02/07/2017': false, '02/08/2017': false, '02/09/2017': false, '02/10/2017': false, '02/11/2017': false, '02/12/2017': false,
              '02/13/2017': false, '02/14/2017': false, '02/15/2017': false, '02/16/2017': false, '02/17/2017': false, '02/18/2017': false,
              '02/19/2017': false, '02/20/2017': false, '02/21/2017': false, '02/22/2017': false, '02/23/2017': false, '02/24/2017': false,
              '02/25/2017': false, '02/26/2017': false, '02/27/2017': false, '02/28/2017': false, '03/01/2017': false, '03/02/2017': true,
              '03/03/2017': true }
            );
          });
      });

    });

    describe('checkInitialLoadedData function', () => {

      let spyFind: any, spyRefresh: any, spyLoad: any;

      let date = new Date();

      beforeEach(() => {
        spyFind = spyOn(comp, 'findNearestDateInPast').and.returnValue(date);
        spyRefresh = spyOn(comp, 'refreshTimeBounds').and.returnValue(true);
        spyLoad = spyOn(comp, 'loadData').and.returnValue(true);
        fixture.detectChanges();
        jasmine.clock().mockDate(date);
      });

      it('should call findNearestDateInPast and call refreshTimeBounds with loadData if ok', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.incidentsByDates = [];
            fixture.detectChanges();
            comp.checkInitialLoadedData();
            expect(spyFind.calls.count()).toEqual(1);
            expect(comp.currentDate).toEqual(date);
            expect(spyRefresh.calls.count()).toEqual(1);
            expect(spyLoad.calls.count()).toEqual(1);
          });
      });

      it('should call findNearestDateInPast and do not call refreshTimeBounds with loadData if no date', () => {
        spyFind.and.returnValue(null);
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.incidentsByDates = [];
            fixture.detectChanges();
            comp.checkInitialLoadedData();
            expect(spyFind.calls.count()).toEqual(1);
            expect(spyRefresh.calls.count()).toEqual(0);
            expect(spyLoad.calls.count()).toEqual(0);
          });
      });

      it('should do nothing if incidentsByDates is not empty', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.incidentsByDates = [{events: {}}, {events: {}}, {events: {}}];
            fixture.detectChanges();
            comp.checkInitialLoadedData();
            expect(spyFind.calls.count()).toEqual(0);
            expect(spyRefresh.calls.count()).toEqual(0);
            expect(spyLoad.calls.count()).toEqual(0);
          });
      });

    });

    describe('findNearestDateInPast function', () => {

      let date = new Date('03/02/2017');

      beforeEach(() => {
        fixture.detectChanges();
        jasmine.clock().mockDate(date);
      });

      it('should return null if incidentsByYear is undefined', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.incidentsByYear = undefined;
            fixture.detectChanges();
            let res = comp.findNearestDateInPast();
            expect(res).toEqual(null);
          });
      });

      it('should return null if incidentsByYear is empty', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.incidentsByYear = {};
            fixture.detectChanges();
            let res = comp.findNearestDateInPast();
            expect(res).toEqual(null);
          });
      });

      it('should return 02/26/2017 date', () => {
        comp.incidentsByYear = {
          '02/07/2017': false, '02/08/2017': false, '02/09/2017': false, '02/10/2017': false, '02/11/2017': false, '02/12/2017': false,
          '02/13/2017': false, '02/14/2017': false, '02/15/2017': false, '02/16/2017': false, '02/17/2017': false, '02/18/2017': false,
          '02/19/2017': false, '02/20/2017': false, '02/21/2017': false, '02/22/2017': false, '02/23/2017': false, '02/24/2017': false,
          '02/25/2017': false, '02/26/2017': true, '02/27/2017': false, '02/28/2017': false, '03/01/2017': false, '03/02/2017': false,
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.findNearestDateInPast();
            expect(res).toEqual(new Date('02/26/2017'));
          });
      });

      it('should return 02/28/2017 date', () => {
        comp.incidentsByYear = {
          '02/07/2017': false, '02/08/2017': false, '02/09/2017': false, '02/10/2017': false, '02/11/2017': false, '02/12/2017': false,
          '02/13/2017': false, '02/14/2017': true, '02/15/2017': false, '02/16/2017': false, '02/17/2017': false, '02/18/2017': false,
          '02/19/2017': false, '02/20/2017': false, '02/21/2017': false, '02/22/2017': false, '02/23/2017': false, '02/24/2017': false,
          '02/25/2017': false, '02/26/2017': true, '02/27/2017': false, '02/28/2017': true, '03/01/2017': false, '03/02/2017': false,
          '03/03/2017': false, '03/04/2017': true,
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.findNearestDateInPast();
            expect(res).toEqual(new Date('02/28/2017'));
          });
      });

    });

    describe('incidentsTypeChanged function', () => {

      let spyGet: any, spyLoad: any;

      beforeEach(() => {
        spyGet = spyOn(comp, 'getCheckedIncidentTypeValues').and.returnValue([1, 2, 3]);
        spyLoad = spyOn(comp, 'loadData').and.returnValue(true);
      });

      it('should call getCheckedIncidentTypeValues with items, set currentIncidentTypeValues to result ' +
          'and call loadData', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.incidentsTypeChanged({
              items: ['a', 'b', 'c']
            });
            expect(spyGet.calls.count()).toEqual(1);
            expect(spyGet.calls.first().args[0]).toEqual(['a', 'b', 'c']);
            expect(comp.currentIncidentTypeValues).toEqual([1, 2, 3]);
            expect(spyLoad.calls.count()).toEqual(1);
          });
      });

      it('should call getCheckedIncidentTypeValues with items, set currentIncidentTypeValues to result ' +
          'and set incidents and incidentsByDates to empty arrays', () => {
        comp.incidents = [{ events: {} }, { events: {} }, { events: {} }];
        comp.incidentsByDates = [{ events: {} }, { events: {} }, { events: {} }];
        spyGet.and.returnValue([]);
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let res = comp.incidentsTypeChanged({
              items: ['a', 'b', 'c']
            });
            expect(spyGet.calls.count()).toEqual(1);
            expect(spyGet.calls.first().args[0]).toEqual(['a', 'b', 'c']);
            expect(comp.currentIncidentTypeValues).toEqual([]);
            expect(spyLoad.calls.count()).toEqual(0);
            expect(comp.incidents).toEqual([]);
            expect(comp.incidentsByDates).toEqual([]);
          });
      });

    });

    it('should set currentDaysCount to event.item.value and call recalculateDates and refreshTimeBounds ' +
        'on daysCountChanged call', () => {
      let spyRecalc = spyOn(comp, 'recalculateDates').and.returnValue(true);
      let spyRefresh = spyOn(comp, 'refreshTimeBounds').and.returnValue(true);
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          comp.daysCountChanged({
            item: {
              value: 3
            }
          });
          expect(comp.currentDaysCount).toEqual(3);
          expect(spyRecalc.calls.count()).toEqual(1);
          expect(spyRefresh.calls.count()).toEqual(1);
        });
    });

    it('should set currentDate to event.date and call refreshTimeBounds and loadData ' +
        'on dateChanged call', () => {
      let date = new Date('03/02/2017');
      let spyRefresh = spyOn(comp, 'refreshTimeBounds').and.returnValue(true);
      let spyLoad = spyOn(comp, 'loadData').and.returnValue(true);
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          comp.dateChanged({
            date: date
          });
          expect(comp.currentDate).toEqual(date);
          expect(spyRefresh.calls.count()).toEqual(1);
          expect(spyLoad.calls.count()).toEqual(1);
        });
    });

    it('should set mobileFiltersOpened to true if mobileFiltersOpened is false on toggleMobileFilters call', () => {
      comp.mobileFiltersOpened = false;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          comp.toggleMobileFilters();
          expect(comp.mobileFiltersOpened).toEqual(true);
        });
    });

    it('should set mobileFiltersOpened to false if mobileFiltersOpened is true on toggleMobileFilters call', () => {
      comp.mobileFiltersOpened = true;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          comp.toggleMobileFilters();
          expect(comp.mobileFiltersOpened).toEqual(false);
        });
    });

    describe('generateCSV function', () => {

      beforeEach(() => {

        comp.incidents = [
          {
            coords: { lat: -2.15635, lon: -80.09 },
            events: { chainsaw: 10, shot: 5, vehicle: 0 },
            eventsCount: 15,
            guid: '124567890',
            shortname: 'Name 1'
          },
          {
            coords: { lat: -2.14294, lon: -80.0884 },
            events: { chainsaw: 30, shot: 2, vehicle: 12 },
            eventsCount: 44,
            guid: '987654321',
            shortname: 'Name 2'
          }
        ];

        comp.incidentsByDates = [
          { date: new Date('03/01/2017'), events: { chainsaw: 5, shot: 2, vehicle: 3 } },
          { date: new Date('03/02/2017'), events: { chainsaw: 15, shot: 12, vehicle: 13 } },
          { date: new Date('03/03/2017'), events: { chainsaw: 25, shot: 22, vehicle: 23 } },
        ];
        comp.currentIncidentTypeValues = ['chainsaw', 'shot', 'vehicle'];

      });

      it('should return null if specified type is not in predefined list', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('custom_type');
            expect(csv).toBeNull();
          });
      });

      it('should return correct string with csv for csv_guardians type', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('csv_guardians');
            expect(csv).toEqual('guardian,chainsaw,shot,vehicle\nName 1,10,5,0\nName 2,30,2,12\n');
          });
      });

      it('should return another correct string with csv for csv_guardians type', () => {
        comp.incidents = [
          {
            coords: { lat: -2.15635, lon: -80.09 },
            events: { chainsaw: 15, shot: 50, vehicle: 3 },
            eventsCount: 15,
            guid: '124567890',
            shortname: 'Name 1'
          },
          {
            coords: { lat: -2.14294, lon: -80.0884 },
            events: { chainsaw: 0, shot: 20, vehicle: 120 },
            eventsCount: 44,
            guid: '987654321',
            shortname: 'Name 2'
          }
        ];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('csv_guardians');
            expect(csv).toEqual('guardian,chainsaw,shot,vehicle\nName 1,15,50,3\nName 2,0,20,120\n');
          });
      });

      it('should return third correct string with csv for csv_guardians type', () => {
        comp.currentIncidentTypeValues = ['chainsaw'];
        fixture.detectChanges();
        TestBed
        .compileComponents()
        .then(() => {
          let csv = comp.generateCSV('csv_guardians');
          expect(csv).toEqual('guardian,chainsaw\nName 1,10\nName 2,30\n');
        });
      });

      it('should return correct string with csv for csv_dates type', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('csv_dates');
            expect(csv).toEqual('date,chainsaw,shot,vehicle\n03/01/2017,5,2,3\n03/02/2017,15,12,13\n03/03/2017,25,22,23\n');
          });
      });

      it('should return another correct string with csv for csv_dates type', () => {
        comp.incidentsByDates = [
          { date: new Date('03/01/2017'), events: { chainsaw: 50, shot: 20, vehicle: 0 } },
          { date: new Date('03/02/2017'), events: { chainsaw: 150, shot: 120, vehicle: 130 } },
          { date: new Date('03/03/2017'), events: { chainsaw: 25, shot: 22, vehicle: 23 } },
        ];
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('csv_dates');
            expect(csv)
              .toEqual('date,chainsaw,shot,vehicle\n03/01/2017,50,20,0\n03/02/2017,150,120,130\n03/03/2017,25,22,23\n');
          });
      });

      it('should return third correct string with csv for csv_dates type', () => {
        comp.currentIncidentTypeValues = ['chainsaw'];
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let csv = comp.generateCSV('csv_dates');
            expect(csv).toEqual('date,chainsaw\n03/01/2017,5\n03/02/2017,15\n03/03/2017,25\n');
          });
      });

    });

    describe('combineCSVFileName function', () => {

      it('should return incidents_some_type_03/01/2017_03/03/2017.csv', () => {
        comp.currentdateStartingAfter = '2017-03-01';
        comp.currentdateEndingBefore = '2017-03-03';
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let str = comp.combineCSVFileName('some_type');
            expect(str).toEqual('incidents_some_type_03/01/2017_03/03/2017.csv');
          });
      });

      it('should return incidents_aaa_10/10/2016_01/29/2017.csv', () => {
        comp.currentdateStartingAfter = '2016-10-10';
        comp.currentdateEndingBefore = '2017-01-29';
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let str = comp.combineCSVFileName('aaa');
            expect(str).toEqual('incidents_aaa_10/10/2016_01/29/2017.csv');
          });
      });

    });

    describe('formatChanged function', () => {

      let spyGener: any, spyCreate: any, spyCreateWin: any, spyComb: any, spyA: any, spyAppend: any, spyRemove: any;
      let aMock = {
        click: () => {
          return true;
        }
      };

      beforeEach(() => {
        spyGener = spyOn(comp, 'generateCSV').and.returnValue('asd');
        spyCreate = spyOn(document, 'createElement').and.returnValue(aMock);
        spyCreateWin = spyOn(window.URL, 'createObjectURL').and.returnValue('ddd');
        spyComb = spyOn(comp, 'combineCSVFileName').and.returnValue('sss');
        spyAppend = spyOn(document.body, 'appendChild').and.returnValue(true);
        spyA = spyOn(aMock, 'click').and.returnValue(true);
        spyRemove = spyOn(document.body, 'removeChild').and.returnValue(true);
        fixture.detectChanges();
      });

      it('should do all stuff', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.formatChanged({
              item: {
                value: 'csv_dates'
              }
            });
            expect(spyGener.calls.count()).toEqual(1);
            expect(spyGener.calls.first().args[0]).toEqual('csv_dates');
            expect(spyCreate.calls.count()).toEqual(1);
            expect(spyCreate.calls.first().args[0]).toEqual('a');
            expect(spyCreateWin.calls.count()).toEqual(1);
            expect(spyComb.calls.count()).toEqual(1);
            expect(spyComb.calls.first().args[0]).toEqual('csv_dates');
            expect(spyAppend.calls.count()).toEqual(1);
            expect(spyA.calls.count()).toEqual(1);
            expect(spyRemove.calls.count()).toEqual(1);
          });
      });

      it('should do nothing if csv is null', () => {
        spyGener.and.returnValue(null);
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.formatChanged({
              item: {
                value: 'csv_dates'
              }
            });
            expect(spyGener.calls.count()).toEqual(1);
            expect(spyGener.calls.first().args[0]).toEqual('csv_dates');
            expect(spyCreate.calls.count()).toEqual(0);
            expect(spyCreateWin.calls.count()).toEqual(0);
            expect(spyComb.calls.count()).toEqual(0);
            expect(spyAppend.calls.count()).toEqual(0);
            expect(spyA.calls.count()).toEqual(0);
            expect(spyRemove.calls.count()).toEqual(0);
          });
      });

    });

  });

}

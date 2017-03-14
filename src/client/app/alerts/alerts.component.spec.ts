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

import { AlertsComponent } from './alerts.component';
import { SiteService } from '../shared/services/site.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { DropdownCheckboxesComponent } from '../shared/dropdown-checkboxes/dropdown-checkboxes.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { RfcxMapComponent, RfcxBaseMapComponent, RfcxMapMarkerComponent } from '../shared/rfcx-map/index';
import { FooterComponent } from '../shared/footer/footer.component';

let jQuery: any = (window as any)['$'];

export function main() {

  describe('Alerts Component', () => {

    let comp: AlertsComponent;
    let fixture: ComponentFixture<AlertsComponent>;
    let expectedData: Array<any>;

    let mockSite = {
      getSites: () => {
        return {
          subscribe: (success: Function, error: Function) => {
            success([
            { name: 'name111', guid: '111' },
            { name: 'name222', guid: '222' },
            { name: 'name333', guid: '333' }
          ]);
          }
        };
      }
    };
    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          AlertsComponent,
          SpinnerComponent,
          DropdownCheckboxesComponent,
          DropdownComponent,
          RfcxMapComponent,
          RfcxBaseMapComponent,
          RfcxMapMarkerComponent,
          FooterComponent
        ],
        providers: [
          { provide: SiteService, useValue: mockSite },
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
      fixture = TestBed.createComponent(AlertsComponent);
      comp = fixture.componentInstance;
      spyOn(comp, 'ngOnInit').and.callFake(() => { return; });
      fixture.detectChanges();
    });

    it('should initialize component variables and call intializeFilterValues and loadData', () => {
      fixture = TestBed.createComponent(AlertsComponent);
      comp = fixture.componentInstance;
      let spyAud = spyOn(comp, 'initAudio').and.callFake(() => { return; });
      let spyFilt = spyOn(comp, 'intializeFilterValues').and.callFake((cb: Function) => { cb(); return; });
      let spyLoad = spyOn(comp, 'loadData').and.callFake(() => { return; });
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.incidentTypes[0]).toEqual({ value: 'vehicle', label: 'Vehicles', checked: true });
          expect(comp.incidentTypes[1]).toEqual({ value: 'shot', label: 'Shots', checked: true });
          expect(comp.incidentTypes[2]).toEqual({ value: 'chainsaw', label: 'Chainsaws', checked: true });
          expect(comp.mapDetails.zoom).toEqual(10);
          expect(comp.mapDetails.maxZoom).toEqual(17);
          expect(comp.mapDetails.lat).toEqual(37.773972);
          expect(comp.mapDetails.lon).toEqual(-122.431297);
          expect(comp.incidents).toEqual([]);
          expect(comp.mapIncidents).toEqual([]);
          expect(comp.mobileFiltersOpened).toEqual(false);
          expect(comp.isLoading).toEqual(false);
          expect(comp.intervalSec).toEqual(30);
          expect(comp.deathTimeMin).toEqual(5);
          expect(spyAud.calls.count()).toEqual(1);
          expect(spyFilt.calls.count()).toEqual(1);
          expect(spyLoad.calls.count()).toEqual(1);
        });
    });

    it('should set currentIncidentTypeValues and currentSiteValues to result of ' +
        'getCheckedDropdownCheckboxItems call and call callback on intializeFilterValues call', () => {
      TestBed
        .compileComponents()
        .then(() => {
          let obj = {
            cb: () => { return; }
          };
          let spyCb = spyOn(obj, 'cb');
          let spyGet = spyOn(comp, 'getCheckedDropdownCheckboxItems').and.returnValue({aa: 'bb'});
          comp.intializeFilterValues(obj.cb);
          expect(spyGet.calls.count()).toEqual(2);
          expect(spyCb.calls.count()).toEqual(1);
          expect(comp.currentIncidentTypeValues).toEqual({aa: 'bb'});
          expect(comp.sitesList).toEqual([
            { label: 'name111', value: '111', checked: true },
            { label: 'name222', value: '222', checked: true },
            { label: 'name333', value: '333', checked: true }
          ]);
          expect(comp.currentSiteValues).toEqual({aa: 'bb'});
        });
    });

  });

}

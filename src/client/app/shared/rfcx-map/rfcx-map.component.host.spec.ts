import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { RfcxMapComponent } from './rfcx-map.component';
import { RfcxBaseMapComponent } from './rfcx-basemap.component';
import { RfcxMapMarkerComponent } from './rfcx-map-marker.component';
import { RfcxMapPieComponent } from './rfcx-map-pie.component';

export function main() {

  describe('RfcxMap Component', () => {

    let comp: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let expectedData: Array<any>;
    let de: DebugElement;
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

    const mapDetails: any = {
      zoom: 10,
      lat: 37.773972,
      lon: -122.431297
    };

    const colors = {
      vehicle: 'rgba(34, 176, 163, 1)',
      shot: 'rgba(240, 65, 84, 1)',
      chainsaw: 'rgba(245, 166, 35, 1)'
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          RfcxMapComponent,
          RfcxBaseMapComponent,
          RfcxMapMarkerComponent,
          RfcxMapPieComponent,
          TestHostComponent],
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
      comp.mapDetails.zoom = mapDetails.zoom;
      comp.mapDetails.lat = mapDetails.lat;
      comp.mapDetails.lon = mapDetails.lon;
      fixture.detectChanges();
      el = fixture.nativeElement;
      de = fixture.debugElement;
    });

    it('should create 3 map layer controls after 2 secs timeout: darkmatter, positron and satellite', (done) => {
      TestBed
        .compileComponents()
        .then(() => {
          setTimeout(() => {
            expect(el.querySelectorAll('.leaflet-control-layers-selector').length).toEqual(3);
            let controls = el.querySelectorAll('.leaflet-control-layers-base > label > div > span');
            expect(el.querySelectorAll('.leaflet-control-layers-base label')[0].querySelector('div > span').textContent)
              .toContain('darkmatter');
            expect(el.querySelectorAll('.leaflet-control-layers-base label')[1].querySelector('div > span').textContent)
              .toContain('positron');
            expect(el.querySelectorAll('.leaflet-control-layers-base label')[2].querySelector('div > span').textContent)
              .toContain('satellite');
            done();
          }, 2001);
        });
    });

    it('should create two map markers', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(el.querySelectorAll('.rfcx-map-marker').length).toEqual(2);
        });
    });

    it('should create two map pies', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(el.querySelectorAll('.rfcx-map-pie').length).toEqual(2);
        });
    });

  });

  @Component({
    template: '<rfcx-map [centerLat]="mapDetails.lat" [centerLon]="mapDetails.lon" [zoom]="mapDetails.zoom" ' +
              '[data]="incidents">' +
                '<rfcx-basemap layerType="darkmatter"></rfcx-basemap>' +
                '<rfcx-basemap layerType="positron"></rfcx-basemap>' +
                '<rfcx-basemap layerType="satellite"></rfcx-basemap>' +
                '<rfcx-map-marker [lat]="incidents[0].coords.lat" [lon]="incidents[0].coords.lon"></rfcx-map-marker>' +
                '<rfcx-map-marker [lat]="incidents[1].coords.lat" [lon]="incidents[1].coords.lon"></rfcx-map-marker>' +
                '<rfcx-map-pie [centerLat]="incidents[0].coords.lat" [shortname]="incidents[0].shortname" ' +
                 '[centerLon]="incidents[0].coords.lon" [diameter]="incidents[0].diameter" [data]="incidents[0].events"' +
                 '[colors]="colors"></rfcx-map-pie>' +
                '<rfcx-map-pie [centerLat]="incidents[1].coords.lat" [shortname]="incidents[1].shortname" ' +
                 '[centerLon]="incidents[1].coords.lon" [diameter]="incidents[1].diameter" [data]="incidents[1].events"' +
                 '[colors]="colors"></rfcx-map-pie>' +
              '</rfcx-map>',
  })
  class TestHostComponent {
    incidents: Array<any>;
    mapDetails: any = {};
    colors: any;
  }

}

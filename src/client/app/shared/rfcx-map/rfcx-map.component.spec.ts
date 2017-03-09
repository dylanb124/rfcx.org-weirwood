import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { RfcxMapComponent } from './rfcx-map.component';

export function main() {

  describe('RfcxMap Component', () => {

    let comp: RfcxMapComponent;
    let fixture: ComponentFixture<RfcxMapComponent>;
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

    const mapDetails: any = {
      zoom: 10,
      lat: 37.773972,
      lon: -122.431297
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [RfcxMapComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(RfcxMapComponent);
      comp = fixture.componentInstance;
      expectedData = initialData.slice(0);
      comp.centerLat = mapDetails.lat;
      comp.centerLon = mapDetails.lon;
      comp.zoom = mapDetails.zoom;
      comp.data = expectedData;
      fixture.detectChanges();
    });

    it('should initialize map with given options', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.rfcxMap.options.center).toEqual([37.773972, -122.431297]);;
          expect(comp.rfcxMap.options.zoom).toEqual(10);
          expect(comp.rfcxMap.options.scrollWheelZoom).toEqual(false);
          expect(comp.rfcxMap.getContainer().getAttribute('class').indexOf('rfcx-map')).not.toEqual(-1);
        });
    });

    it('should initialize map with another options', () => {
      fixture = TestBed.createComponent(RfcxMapComponent);
      comp = fixture.componentInstance;
      comp.centerLat = 40.223344;
      comp.centerLon = -111.335511;
      comp.zoom = 13;
      comp.minZoom = 14;
      comp.maxZoom = 17;
      comp.data = expectedData;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.rfcxMap.options.center).toEqual([40.223344, -111.335511]);;
          expect(comp.rfcxMap.options.zoom).toEqual(13);
          expect(comp.rfcxMap.options.minZoom).toEqual(14);
          expect(comp.rfcxMap.options.maxZoom).toEqual(17);
          expect(comp.rfcxMap.options.scrollWheelZoom).toEqual(false);
          expect(comp.rfcxMap.getContainer().getAttribute('class').indexOf('rfcx-map')).not.toEqual(-1);
        });
    });

  });
}

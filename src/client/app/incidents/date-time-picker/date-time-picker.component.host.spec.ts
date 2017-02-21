import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { click } from '../../shared/testing/helpers';
import { FormsModule } from '@angular/forms';

import { IncidentsDateTimePickerComponent } from './date-time-picker.component';

export function main() {

  describe('IncidentsDateTimePicker Component', () => {

    let comp: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let expectedData: Array<any>;
    let de: DebugElement;
    let el: HTMLElement;

    const incidentsByYear = {
          '10/02/2017': true,
          '11/02/2017': true,
          '12/02/2017': true,
          '13/02/2017': true,
          '14/02/2017': true,
          '15/02/2017': false,
          '16/02/2017': false,
          '17/02/2017': false,
          '18/02/2017': false,
          '19/02/2017': false,
          '20/02/2017': false,
        };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [IncidentsDateTimePickerComponent, TestHostComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      comp = fixture.componentInstance;
      comp.incidentsByYear = Object.assign({}, incidentsByYear);
      comp.currentDate = new Date('02/20/2017');
      comp.maxDate = new Date('02/26/2017');
      comp.range = 0;
      fixture.detectChanges();
      el = fixture.nativeElement;
      de = fixture.debugElement;
    });

    it('should change component label to `Feb 22` after currentDate change', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Choose date');
          comp.currentDate = new Date('02/22/2017');
          fixture.detectChanges();
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Feb 22');
        });
    });

    it('should change component label to `Feb 18 - Feb 21` after currentDate change', () => {
      comp.range = 3;
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Choose date');
          comp.currentDate = new Date('02/18/2017');
          fixture.detectChanges();
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Feb 18 — Feb 21');
        });
    });

    it('should change component label to `Feb 18 - Feb 25` after currentDate change', () => {
      comp.range = 7;
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Choose date');
          comp.currentDate = new Date('02/18/2017');
          fixture.detectChanges();
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Feb 18 — Feb 25');
        });
    });

    it('should change component label to `Feb 18` after currentDate change', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Choose date');
          comp.maxDate = new Date('02/18/2017');
          fixture.detectChanges();
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Feb 18');
        });
    });

    it('should change component label to `Feb 19` after currentDate change', () => {
      comp.range = 1;
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Choose date');
          comp.maxDate = new Date('02/19/2017');
          fixture.detectChanges();
          expect(de.query(By.css('.date-time-picker-rfcx__label-text')).nativeElement.textContent).toEqual('Feb 19');
        });
    });

  });

  @Component({
    template: '<date-time-picker-incidents [incidentsByYear]="incidentsByYear" [maxDate]="maxDate" ' +
                '(onChange)="dateChanged($event)" [range]="range" [date]="currentDate"></date-time-picker-incidents>'
  })
  class TestHostComponent {
    incidentsByYear: any;
    currentDate: Date;
    maxDate: Date;
    range: number;
    dateChanged(event: any) { return true; }
  }

}

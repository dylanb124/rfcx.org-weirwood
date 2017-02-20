import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DateTimePickerComponent } from './date-time-picker.component';

export function main() {

  describe('DateTimePicker Component', () => {

    let comp: DateTimePickerComponent;
    let fixture: ComponentFixture<DateTimePickerComponent>;
    let de: DebugElement;

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [DateTimePickerComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(DateTimePickerComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should initialize DateTimePicker', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.dateTimePicker).toBe(comp.dateTimePickerEl);
          expect(comp.dateTimePicker.data('DateTimePicker')).toBeDefined();
        });
    });

    it('should initialize DateTimePicker options properly', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.dateTimePicker).toBe(comp.dateTimePickerEl);
          expect(comp.dateTimePicker.data('DateTimePicker').format()).toEqual('DD/MM/YYYY');
          expect(comp.dateTimePicker.data('DateTimePicker').minDate()).toEqual(false);
          expect(comp.dateTimePicker.data('DateTimePicker').maxDate()).toEqual(false);
          expect(comp.dateTimePicker.data('DateTimePicker').icons().next).toEqual('icon-chevron-right');
          expect(comp.dateTimePicker.data('DateTimePicker').icons().previous).toEqual('icon-chevron-left');
        });
    });

    it('should initialize DateTimePicker options from inputs properly', () => {
      fixture = TestBed.createComponent(DateTimePickerComponent);
      de = fixture.debugElement;
      comp = fixture.componentInstance;
      let minDate = new Date('01/01/2017');
      let maxDate = new Date('02/20/2017');
      comp.minDate = minDate;
      comp.maxDate = maxDate;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(new Date(comp.dateTimePicker.data('DateTimePicker').minDate())).toEqual(minDate);
          expect(new Date(comp.dateTimePicker.data('DateTimePicker').maxDate())).toEqual(maxDate);
        });
    });

    it('should initialize DateTimePicker with disabled input', () => {
      fixture = TestBed.createComponent(DateTimePickerComponent);
      de = fixture.debugElement;
      comp = fixture.componentInstance;
      comp.disabled = true;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.js-datetimepicker-input')).nativeElement.getAttribute('disabled')).toBeDefined();
          expect(de.query(By.css('.js-datetimepicker-label')).nativeElement.getAttribute('class')).toContain('disabled');
        });
    });

    it('should emit onChange event on dp.change event', () => {
      let spyFunc = spyOn(comp.onChange, 'emit');
      let date = new Date('01/01/2017');
      TestBed
        .compileComponents()
        .then(() => {
          expect(spyFunc.calls.count()).toEqual(0);
          comp.dateTimePicker.data('DateTimePicker').date(date);
          expect(spyFunc.calls.count()).toEqual(1);
          expect(new Date(spyFunc.calls.first().args[0].date)).toEqual(date);
        });
    });

  });

}

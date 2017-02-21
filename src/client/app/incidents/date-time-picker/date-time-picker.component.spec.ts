import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IncidentsDateTimePickerComponent } from './date-time-picker.component';

export function main() {

  describe('IncidentsDateTimePicker Component', () => {

    let comp: IncidentsDateTimePickerComponent;
    let fixture: ComponentFixture<IncidentsDateTimePickerComponent>;
    let de: DebugElement;
    let inputDate: Date;

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [IncidentsDateTimePickerComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      inputDate = new Date('02/20/2017');
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      comp.date = inputDate;
      de = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should initialize IncidentsDateTimePicker', () => {
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
          expect(comp.dateTimePicker.data('DateTimePicker').keepOpen()).toEqual(false);
          expect(comp.dateTimePicker.data('DateTimePicker').icons().next).toEqual('icon-chevron-right');
          expect(comp.dateTimePicker.data('DateTimePicker').icons().previous).toEqual('icon-chevron-left');
        });
    });

    it('should initialize DateTimePicker options from inputs properly', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
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
          expect(new Date(comp.dateTimePicker.data('DateTimePicker').date())).toEqual(maxDate);
        });
    });

    it('should not call refreshSelectedDate and updateLabel if range is equal to 0', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      comp.range = 0;
      let spyRefresh = spyOn(comp, 'refreshSelectedDate');
      let spyUpdate = spyOn(comp, 'updateLabel');
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(spyRefresh.calls.count()).toEqual(0);
          expect(spyUpdate.calls.count()).toEqual(0);
        });
    });

    it('should call refreshSelectedDate and updateLabel if range is not equal to 0', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      comp.range = 1;
      let spyRefresh = spyOn(comp, 'refreshSelectedDate');
      let spyUpdate = spyOn(comp, 'updateLabel');
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(spyRefresh.calls.count()).toEqual(1);
          expect(spyUpdate.calls.count()).toEqual(1);
        });
    });

    it('should set isOpened to true, set tempDate to current date and call highlightNonEmptyDates on dp.show event', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      let minDate = new Date('01/01/2017');
      let maxDate = new Date('02/20/2017');
      comp.minDate = minDate;
      comp.maxDate = maxDate;
      let spyFunc = spyOn(comp, 'highlightNonEmptyDates');
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.isOpened).toEqual(false);
          expect(comp.tempDate).toBeUndefined();
          expect(spyFunc.calls.count()).toEqual(0);
          comp.dateTimePicker.trigger('dp.show');
          expect(comp.isOpened).toEqual(true);
          expect(new Date(comp.tempDate)).toEqual(maxDate);
          expect(spyFunc.calls.count()).toEqual(1);
        });
    });

    it('should call highlightNonEmptyDates on dp.update event', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      let minDate = new Date('01/01/2017');
      let maxDate = new Date('02/20/2017');
      comp.minDate = minDate;
      comp.maxDate = maxDate;
      let spyFunc = spyOn(comp, 'highlightNonEmptyDates');
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(spyFunc.calls.count()).toEqual(0);
          comp.dateTimePicker.trigger('dp.update');
          expect(spyFunc.calls.count()).toEqual(1);
        });
    });

    it('should set isOpened to false, call refreshSelectedDate on dp.hide event', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      let minDate = new Date('01/01/2017');
      let maxDate = new Date('02/20/2017');
      comp.minDate = minDate;
      comp.maxDate = maxDate;
      comp.isOpened = true;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          let spyRefresh = spyOn(comp, 'refreshSelectedDate');
          expect(comp.isOpened).toEqual(true);
          comp.dateTimePicker.trigger('dp.hide');
          expect(comp.isOpened).toEqual(false);
          expect(spyRefresh.calls.count()).toEqual(1);
        });
    });

    it('should emit onChange event and call updateLabel on dp.hide event', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      comp = fixture.componentInstance;
      let minDate = new Date('01/01/2017');
      let maxDate = new Date('02/20/2017');
      comp.minDate = minDate;
      comp.maxDate = maxDate;
      comp.isOpened = true;
      comp.selectedDate = new Date(maxDate);
      comp.tempDate = new Date('02/19/2017');
      spyOn(comp, 'refreshSelectedDate').and.returnValue(true);
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          let spyFunc = spyOn(comp, 'updateLabel');
          let spyEmit = spyOn(comp.onChange, 'emit');
          comp.dateTimePicker.trigger('dp.hide');
          expect(spyFunc.calls.count()).toEqual(1);
          expect(spyEmit.calls.count()).toEqual(1);
        });
    });

    it('should initialize DateTimePicker with disabled input', () => {
      fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
      de = fixture.debugElement;
      comp = fixture.componentInstance;
      comp.disabled = true;
      fixture.detectChanges();
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.query(By.css('.js-datetimepicker-input')).nativeElement.getAttribute('disabled')).toBeDefined();
          expect(de.query(By.css('.date-time-picker-rfcx__label')).nativeElement.getAttribute('class')).toContain('disabled');
        });
    });

    describe('incidentsByYear input', () => {

      it('should add proper classes for elements according to incidentsByYear object', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.incidentsByYear = {
          '10/02/2017': true,
          '11/02/2017': false,
          '12/02/2017': true,
          '13/02/2017': false,
          '14/02/2017': false,
          '15/02/2017': true,
          '16/02/2017': true,
          '17/02/2017': false,
          '18/02/2017': false,
          '19/02/2017': false,
          '20/02/2017': true,
        };
        let mockObj = {
          addClass: () => { return true; }
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let spyFind = spyOn(comp.dateTimePickerEl, 'find').and.returnValue(mockObj);
            let spyClass = spyOn(mockObj, 'addClass').and.callThrough();
            fixture.detectChanges();
            comp.highlightNonEmptyDates();
            expect(spyFind.calls.count()).toEqual(5);
            expect(spyClass.calls.count()).toEqual(5);
            expect(spyFind.calls.allArgs()).toEqual([
              ['td[data-day="10/02/2017"]'],
              ['td[data-day="12/02/2017"]'],
              ['td[data-day="15/02/2017"]'],
              ['td[data-day="16/02/2017"]'],
              ['td[data-day="20/02/2017"]']
            ]);
            expect(spyClass.calls.allArgs()).toEqual([
              ['rfcx-has-events'],
              ['rfcx-has-events'],
              ['rfcx-has-events'],
              ['rfcx-has-events'],
              ['rfcx-has-events']
            ]);
          });
      });

      it('should add another proper classes for elements according to incidentsByYear object', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.incidentsByYear = {
          '10/02/2017': false,
          '11/02/2017': true,
          '12/02/2017': true,
          '13/02/2017': false,
          '14/02/2017': true,
          '15/02/2017': false,
          '16/02/2017': false,
          '17/02/2017': false,
          '18/02/2017': false,
          '19/02/2017': true,
          '20/02/2017': false,
        };
        let mockObj = {
          addClass: () => { return true; }
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let spyFind = spyOn(comp.dateTimePickerEl, 'find').and.returnValue(mockObj);
            let spyClass = spyOn(mockObj, 'addClass').and.callThrough();
            fixture.detectChanges();
            comp.highlightNonEmptyDates();
            expect(spyFind.calls.count()).toEqual(4);
            expect(spyClass.calls.count()).toEqual(4);
            expect(spyFind.calls.allArgs()).toEqual([
              ['td[data-day="11/02/2017"]'],
              ['td[data-day="12/02/2017"]'],
              ['td[data-day="14/02/2017"]'],
              ['td[data-day="19/02/2017"]']
            ]);
            expect(spyClass.calls.allArgs()).toEqual([
              ['rfcx-has-events'],
              ['rfcx-has-events'],
              ['rfcx-has-events'],
              ['rfcx-has-events']
            ]);
          });
      });

      it('should not add any classes for elements if incidentsByYear has none true values', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.incidentsByYear = {
          '10/02/2017': false,
          '11/02/2017': false,
          '12/02/2017': false,
          '13/02/2017': false,
          '14/02/2017': false,
          '15/02/2017': false,
          '16/02/2017': false,
          '17/02/2017': false,
          '18/02/2017': false,
          '19/02/2017': false,
          '20/02/2017': false,
        };
        let mockObj = {
          addClass: () => { return true; }
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let spyFind = spyOn(comp.dateTimePickerEl, 'find').and.returnValue(mockObj);
            let spyClass = spyOn(mockObj, 'addClass').and.callThrough();
            fixture.detectChanges();
            comp.highlightNonEmptyDates();
            expect(spyFind.calls.count()).toEqual(0);
            expect(spyClass.calls.count()).toEqual(0);
          });
      });

      it('should not add any classes for elements if incidentsByYear is undefined', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.incidentsByYear = undefined;
        let mockObj = {
          addClass: () => { return true; }
        };
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            let spyFind = spyOn(comp.dateTimePickerEl, 'find').and.returnValue(mockObj);
            let spyClass = spyOn(mockObj, 'addClass').and.callThrough();
            fixture.detectChanges();
            comp.highlightNonEmptyDates();
            expect(spyFind.calls.count()).toEqual(0);
            expect(spyClass.calls.count()).toEqual(0);
          });
      });

    });

    describe('updateLabel method', () => {

      it('should set label to Feb 2', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        comp = fixture.componentInstance;
        comp.range = 1;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.selectedDate = new Date('02/02/2017');
            fixture.detectChanges();
            comp.updateLabel();
            expect(comp.label).toEqual('Feb 2');
          });
      });

      it('should set label to Feb 3', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        comp = fixture.componentInstance;
        comp.range = 2;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.selectedDate = new Date('02/03/2017');
            fixture.detectChanges();
            comp.updateLabel();
            expect(comp.label).toEqual('Feb 3');
          });
      });

      it('should set label to Feb 3 — Feb 10', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        comp = fixture.componentInstance;
        comp.range = 7;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.selectedDate = new Date('02/03/2017');
            fixture.detectChanges();
            comp.updateLabel();
            expect(comp.label).toEqual('Feb 3 — Feb 10');
          });
      });

      it('should set label to Feb 3 — Mar 5', () => {
        fixture = TestBed.createComponent(IncidentsDateTimePickerComponent);
        comp = fixture.componentInstance;
        comp.range = 30;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            comp.selectedDate = new Date('02/03/2017');
            fixture.detectChanges();
            comp.updateLabel();
            expect(comp.label).toEqual('Feb 3 — Mar 5');
          });
      });

    });

  });

}

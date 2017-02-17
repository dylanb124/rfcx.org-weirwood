import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DropdownCheckboxItem } from './dropdown-item';
import { DropdownCheckboxesComponent } from './dropdown-checkboxes.component';

export function main() {

  describe('DropdownCheckboxes Component', () => {

    let comp: DropdownCheckboxesComponent;
    let fixture: ComponentFixture<DropdownCheckboxesComponent>;
    let expectedData: Array<DropdownCheckboxItem>;
    let de: DebugElement;

    const items: Array<DropdownCheckboxItem> = [
      { value: 111, label: '111', checked: true },
      { value: 222, label: '222', checked: true },
      { value: 333, label: '333', checked: false },
    ];

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [DropdownCheckboxesComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(DropdownCheckboxesComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement;
      expectedData = items.slice(0);
      comp.items = expectedData;
      fixture.detectChanges();
    });

    it('should create 3 html dropdown items', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(de.queryAll(By.css('.dropdown-rfcx__label')).length).toEqual(3);
          expect(de.queryAll(By.css('.dropdown-rfcx__label'))[0].nativeElement.textContent).toContain('111');
          expect(de.queryAll(By.css('.dropdown-rfcx__label'))[1].nativeElement.textContent).toContain('222');
          expect(de.queryAll(By.css('.dropdown-rfcx__label'))[2].nativeElement.textContent).toContain('333');
        });
    });

    describe('title and currentItems', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should set currentItem to first and second DropdownCheckboxItem and dropdown title ' +
          'to "111, 222"', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1]]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('111, 222');
          });
      });

      it('should set currentItem to second and third DropdownCheckboxItem and dropdown title ' +
          'to "222, 333"', () => {
        expectedData = [
          { value: 111, label: '111', checked: false },
          { value: 222, label: '222', checked: true },
          { value: 333, label: '333', checked: true },
        ];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[1], expectedData[2]]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('222, 333');
          });
      });

      it('should set currentItem to second DropdownCheckboxItem and dropdown title to "222"', () => {
        expectedData = [
          { value: 111, label: '111', checked: false },
          { value: 222, label: '222', checked: true },
          { value: 333, label: '333', checked: false },
        ];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[1]]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('222');
          });
      });

      it('should set currentItem to all DropdownCheckboxItem and dropdown title to allItemsTitle', () => {
        expectedData = [
          { value: 111, label: '111', checked: true },
          { value: 222, label: '222', checked: true },
          { value: 333, label: '333', checked: true },
        ];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1], expectedData[2]]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('All items');
          });
      });

      it('should set currentItem to all DropdownCheckboxItem and dropdown title to custom allItemsTitle', () => {
        expectedData = [
          { value: 111, label: '111', checked: true },
          { value: 222, label: '222', checked: true },
          { value: 333, label: '333', checked: true },
        ];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        comp.allItemsTitle = 'Test title';
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1], expectedData[2]]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('Test title');
          });
      });

      it('should not set currentItem to any variable and set dropdown title to "Choose" ' +
          'if no items are pre-selected (default value)', () => {
        expectedData = [
          { value: 111, label: '111', checked: false },
          { value: 222, label: '222', checked: false },
          { value: 333, label: '333', checked: false },
        ];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('Choose');
          });
      });


      it('should not set currentItem to any variable and set dropdown title to "No items" ' +
          'if items array is empty', () => {
        expectedData = [];
        fixture = TestBed.createComponent(DropdownCheckboxesComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([]);
            expect(de.query(By.css('.dropdown-rfcx__title')).nativeElement.textContent).toContain('No items');
          });
      });

    });

    describe('dropup attribute', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should add "dropup" class to dropdown-rfcx container if "dropup" input is set to true', () => {
        comp.dropup = true;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).toContain('dropup');
          });
      });

      it('should not add "dropup" class to dropdown-rfcx container if "dropup" input is set to false', () => {
        comp.dropup = false;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('dropup');
          });
      });

      it('should not add "dropup" class to dropdown-rfcx container if "dropup" input is not set', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('dropup');
          });
      });

    });

    describe('disabled attribute', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should set disabled attribute on dropdown-toggle button if "disabled" input is set to true', () => {
        comp.disabled = true;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.getAttribute('disabled')).toBeDefined();
          });
      });

      it('should not set disabled attribute on dropdown-toggle button if "disabled" input is set to false', () => {
        comp.disabled = false;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.getAttribute('disabled')).toBeNull();
          });
      });

      it('should not set disabled attribute on dropdown-toggle button if "disabled" input is not set', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.getAttribute('disabled')).toBeNull();
          });
      });

    });

    describe('block attribute', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should add "block" class to dropdown-rfcx container if "block" input is set to true', () => {
        comp.block = true;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).toContain('block');
          });
      });

      it('should not add "block" class to dropdown-rfcx container if "block" input is set to false', () => {
        comp.block = false;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('block');
          });
      });

      it('should not add "block" class to dropdown-rfcx container if "block" input is not set', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('block');
          });
      });

    });

    describe('noborder attribute', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should add "noborder" class to dropdown-rfcx container if "noborder" input is set to true', () => {
        comp.noborder = true;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).toContain('noborder');
          });
      });

      it('should not add "noborder" class to dropdown-rfcx container if "noborder" input is set to false', () => {
        comp.noborder = false;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('noborder');
          });
      });

      it('should not add "noborder" class to dropdown-rfcx container if "noborder" input is not set', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('noborder');
          });
      });

    });

    describe('changeValue method', () => {

      let mockEvent: Event;

      beforeEach(() => {
        mockEvent = new Event('change');
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should set currentItems to all items', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1]]);
            expectedData[2] = { value: 333, label: '333', checked: true };
            fixture.detectChanges();
            comp.changeValue(mockEvent, expectedData[2]);
            fixture.detectChanges();
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1], expectedData[2]]);
          });
      });

      it('should set currentItems to first item', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1]]);
            expectedData[1] = { value: 222, label: '222', checked: false };
            fixture.detectChanges();
            comp.changeValue(mockEvent, expectedData[1]);
            fixture.detectChanges();
            expect(comp.currentItems).toEqual([expectedData[0]]);
          });
      });

      it('should set currentItems to empty array', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItems).toEqual([expectedData[0], expectedData[1]]);
            expectedData[0] = { value: 111, label: '111', checked: false };
            expectedData[1] = { value: 222, label: '222', checked: false };
            fixture.detectChanges();
            comp.changeValue(mockEvent, expectedData[1]);
            comp.changeValue(mockEvent, expectedData[0]);
            fixture.detectChanges();
            expect(comp.currentItems).toEqual([]);
          });
      });

      it('should emit event', () => {
        TestBed
          .compileComponents()
          .then(() => {
            let spyFunc = spyOn(comp.onChange, 'emit');
            expect(spyFunc.calls.count()).toEqual(0);
            expectedData[1] = { value: 222, label: '222', checked: false };
            fixture.detectChanges();
            comp.changeValue(mockEvent, expectedData[1]);
            expect(spyFunc.calls.count()).toEqual(1);
            expect(spyFunc.calls.first().args[0]).toEqual({items: [expectedData[0]]});
          });
      });

    });

    describe('preventLinkClick method', () => {

      let mockEvent: Event;

      beforeEach(() => {
        mockEvent = new Event('click');
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should call stopPropagation method on event', () => {
        let spyFunc = spyOn(mockEvent, 'stopPropagation');
        TestBed
          .compileComponents()
          .then(() => {
            expect(spyFunc.calls.count()).toEqual(0);
            comp.preventLinkClick(mockEvent);
            fixture.detectChanges();
            expect(spyFunc.calls.count()).toEqual(1);
          });
      });

    });

  });

}

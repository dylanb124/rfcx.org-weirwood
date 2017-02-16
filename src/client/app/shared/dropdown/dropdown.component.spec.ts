import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DropdownItem } from './dropdown-item';
import { DropdownComponent } from './dropdown.component';

export function main() {

  describe('Dropdown Component', () => {

    let comp: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;
    let expectedData: Array<DropdownItem>;
    let de: DebugElement;

    const items: Array<DropdownItem> = [
      { value: 111, label: '111', selected: true },
      { value: 222, label: '222' },
      { value: 333, label: '333' },
    ];

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [DropdownComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(DropdownComponent);
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
          expect(de.queryAll(By.css('.dropdown-rfcx__link')).length).toEqual(3);
          expect(de.queryAll(By.css('.dropdown-rfcx__link'))[0].nativeElement.textContent).toContain('111');
          expect(de.queryAll(By.css('.dropdown-rfcx__link'))[1].nativeElement.textContent).toContain('222');
          expect(de.queryAll(By.css('.dropdown-rfcx__link'))[2].nativeElement.textContent).toContain('333');
        });
    });

    describe('title and currentItem', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should set currentItem to first DropdownItem and dropdown title to "111" (selected item)', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItem).toBe(expectedData[0]);
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.textContent).toContain('111');
          });
      });

      it('should set currentItem to third DropdownItem and dropdown title to "333" (another selected item)', () => {
        expectedData = [
          { value: 111, label: '111' },
          { value: 222, label: '222' },
          { value: 333, label: '333', selected: true },
        ];
        fixture = TestBed.createComponent(DropdownComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItem).toBe(expectedData[2]);
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.textContent).toContain('333');
          });
      });

      it('should not set currentItem to any variable and set dropdown title to "Choose" ' +
          'if no items are pre-selected (default value)', () => {
        expectedData = [
          { value: 111, label: '111' },
          { value: 222, label: '222' },
          { value: 333, label: '333' },
        ];
        fixture = TestBed.createComponent(DropdownComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItem).toBeUndefined();
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.textContent).toContain('Choose');
          });
      });

      it('should not set currentItem to any variable and set dropdown title to "No items" ' +
          'if items array is empty', () => {
        expectedData = [];
        fixture = TestBed.createComponent(DropdownComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        comp.items = expectedData;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItem).toBeUndefined();
            expect(de.query(By.css('.dropdown-toggle')).nativeElement.textContent).toContain('No items');
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

    describe('download attribute', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should add "download" class to dropdown-rfcx container if "download" input is set to true', () => {
        comp.download = true;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).toContain('download');
          });
      });

      it('should not add "download" class to dropdown-rfcx container if "download" input is set to false', () => {
        comp.download = false;
        fixture.detectChanges();
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('download');
          });
      });

      it('should not add "download" class to dropdown-rfcx container if "download" input is not set', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(de.query(By.css('.dropdown-rfcx')).nativeElement.getAttribute('class')).not.toContain('download');
          });
      });

    });

    describe('changeValue method', () => {

      beforeEach(() => {
        expectedData = items.slice(0);
        comp.items = expectedData;
        fixture.detectChanges();
      });

      it('should set currentItem to second item', () => {
        TestBed
          .compileComponents()
          .then(() => {
            expect(comp.currentItem).toBe(expectedData[0]);
            comp.changeValue(expectedData[1]);
            fixture.detectChanges();
            expect(comp.currentItem).toBe(expectedData[1]);
          });
      });

    });

  });

}

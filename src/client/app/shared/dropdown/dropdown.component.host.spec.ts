import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { click } from '../testing/helpers';

import { DropdownItem } from './dropdown-item';
import { DropdownComponent } from './dropdown.component';

export function main() {

  describe('Dropdown Component', () => {

    let comp: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let expectedData: Array<any>;
    let de: DebugElement;
    let el: HTMLElement;

    const items: Array<DropdownItem> = [
      { value: 111, label: '111', selected: true },
      { value: 222, label: '222' },
      { value: 333, label: '333' },
    ];

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [DropdownComponent, TestHostComponent],
      })
        .compileComponents();
    }));

    it('should call onChange event handler', () => {
      fixture = TestBed.createComponent(TestHostComponent);
      comp = fixture.componentInstance;
      expectedData = items.slice(0);
      comp.items = expectedData;
      fixture.detectChanges();
      el = fixture.nativeElement;
      de = fixture.debugElement;

      let spyFunc = spyOn(comp, 'onChangeFunc');
      TestBed
        .compileComponents()
        .then(() => {
          expect(spyFunc.calls.count()).toEqual(0);
          click(de.queryAll(By.css('.dropdown-rfcx__link'))[2]);
          expect(spyFunc.calls.count()).toEqual(1);
          expect(spyFunc.calls.first().args[0]).toEqual({item: {value: 333, label: '333'}});
        });
    });

  });

  @Component({
    template: '<dropdown [items]="items" (onChange)="onChangeFunc($event)"></dropdown>'
  })
  class TestHostComponent {
    items: Array<DropdownItem>;
    onChangeFunc(event: any) { return true; }
  }

}

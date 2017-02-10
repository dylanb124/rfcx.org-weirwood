import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SpinnerComponent } from './spinner.component';

export function main() {

  describe('Spinner Component', () => {

    let comp: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;
    let expectedData: Array<any>;
    let de: DebugElement;
    let el: HTMLElement;

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SpinnerComponent],
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(SpinnerComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.css('.sk-circle'));
      el = de.nativeElement;
      fixture.detectChanges();
    });

    it('should render spinner with predefined size', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(el.style.width).toEqual('32px');
          expect(el.style.height).toEqual('32px');
        });
    });

    it('should render spinner with 12 nested elements', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(el.querySelectorAll('.sk-child').length).toEqual(12);
        });
    });

  });

}

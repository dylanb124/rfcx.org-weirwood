import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import {
  async
} from '@angular/core/testing';
import {
  Route
} from '@angular/router';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { APP_CONFIG, AppConfig } from './app.config';

export function main() {

  describe('App component', () => {

    let config: Route[] = [
      // { path: '', component: HomeComponent }
    ];
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          RouterTestingModule.withRoutes(config),
          SharedModule.forRoot()
        ],
        declarations: [
          TestComponent,
          AppComponent],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: APP_CONFIG, useValue: AppConfig }
        ]
      });
    });

    it('should build without a problem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;

            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<rfcx-org></rfcx-org>'
})

class TestComponent {
}

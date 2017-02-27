import { Directive, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

export class MockActivatedRoute extends ActivatedRoute {
  params: Observable<Params>;

  constructor(parameters?: { [key: string]: any; }) {
    super();
    this.params = Observable.of(parameters);
  }
}

export class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

@Directive({
  selector: '[routerLink], [routerLinkActive]'
})
export class RouterLinkStubDirective {}

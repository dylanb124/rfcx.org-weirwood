import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'spinner',
  templateUrl: 'spinner.component.html'
})
export class SpinnerComponent {

  @Input() public size: number = 32;

}

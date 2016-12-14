import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector-name
  selector: 'spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent {

  // tslint:disable-next-line:no-unused-variable
  @Input() public size:number = 32;

}

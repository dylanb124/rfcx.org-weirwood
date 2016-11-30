import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent {

  @Input() public size:number = 32;
  constructor() {}

}

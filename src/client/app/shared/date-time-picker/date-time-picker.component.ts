import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: ['date-time-picker.component.css'],
})
export class DateTimePickerComponent {

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        jQuery(this.elementRef.nativeElement.getElementsByClassName('js-datetimepicker')[0]).datetimepicker({
          format: 'DD/MM/YYYY',
          showClose: true,
          debug: true
        });
    }

}

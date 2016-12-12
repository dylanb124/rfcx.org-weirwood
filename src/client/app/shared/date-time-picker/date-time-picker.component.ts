import { Component, Input, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';

// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: ['date-time-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DateTimePickerComponent {

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        jQuery(this.elementRef.nativeElement.getElementsByClassName('js-datetimepicker')[0]).datetimepicker({
          format: 'DD/MM/YYYY',
          maxDate: new Date(),
          icons: {
            previous: 'icon-chevron-left',
            next: 'icon-chevron-right'
          }
        });
    }

}

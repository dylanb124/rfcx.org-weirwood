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

  private dateTimePickerEl: any;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() disabled: boolean;
  @Input() disabledDates: Array<any>;
  @Output() onChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.dateTimePickerEl = jQuery(this.elementRef.nativeElement.getElementsByClassName('js-datetimepicker')[0]);
    this.dateTimePickerEl.datetimepicker({
      format: 'DD/MM/YYYY',
      minDate: this.minDate || false,
      maxDate: this.maxDate || false,
      icons: {
        previous: 'icon-chevron-left',
        next: 'icon-chevron-right'
      }
    });

    this.dateTimePickerEl.on('dp.change', () => {
      let newDate = this.dateTimePickerEl.data("DateTimePicker").date();
      this.onChange.emit({
          date: newDate
      });
    });
  }

}

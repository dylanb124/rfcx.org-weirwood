import { Component, Input, Output, EventEmitter, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';

// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: ['date-time-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DateTimePickerComponent implements OnInit {

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() disabled: boolean;
  @Output() onChange = new EventEmitter();
  public dateTimePicker: any;
  public dateTimePickerEl: any;

  constructor(
    public elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.dateTimePickerEl = jQuery(this.elementRef.nativeElement.getElementsByClassName('js-datetimepicker')[0]);
    this.dateTimePicker = this.dateTimePickerEl.datetimepicker({
      format: 'DD/MM/YYYY',
      minDate: this.minDate || false,
      maxDate: this.maxDate || false,
      icons: {
        next: 'icon-chevron-right',
        previous: 'icon-chevron-left'
      }
    });

    this.dateTimePickerEl.on('dp.change', () => {
      let newDate = this.dateTimePickerEl.data('DateTimePicker').date();
      this.onChange.emit({
        date: newDate
      });
    });
  }

}

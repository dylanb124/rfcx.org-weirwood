import { Component, Input, Output, EventEmitter, ElementRef, ViewEncapsulation, OnInit, OnChanges } from '@angular/core';

import * as moment from 'moment';
// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];
const labelFormat: string = 'MMM D';

@Component({
  moduleId: module.id,
  selector: 'date-time-picker-incidents',
  templateUrl: 'date-time-picker-incidents.component.html',
  styleUrls: ['date-time-picker-incidents.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DateTimePickerIncidentsComponent implements OnInit, OnChanges {

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() range: number;
  @Input() disabled: boolean;
  @Input() disabledDates: Array<any>;
  @Output() onChange = new EventEmitter();
  private dateTimePickerEl: any;
  private isOpened: boolean;
  private label: string = 'Choose date';
  private selectedDate: Date;
  private tempDate: Date;

  constructor(private elementRef: ElementRef) {}

  updateLabel() {
    if (this.range - 1 < 2) {
      this.label = moment(this.selectedDate).format(labelFormat);
    }
    else {
      this.label = moment(this.selectedDate).format(labelFormat) + ' — ' +
                   moment(this.selectedDate).add(this.range, 'days').format(labelFormat);
    }
  }

  ngOnInit() {
    this.dateTimePickerEl = jQuery(this.elementRef.nativeElement.getElementsByClassName('js-datetimepicker')[0]);
    this.dateTimePickerEl.datetimepicker({
      format: 'DD/MM/YYYY',
      minDate: this.minDate || false,
      maxDate: this.maxDate || false,
      keepOpen: false,
      icons: {
        previous: 'icon-chevron-left',
        next: 'icon-chevron-right'
      }
    });

    this.dateTimePickerEl.on('dp.show', () => {
      this.isOpened = true;
      this.tempDate = this.dateTimePickerEl.data('DateTimePicker').date().toDate();
    });

    this.dateTimePickerEl.on('dp.hide', () => {
      this.isOpened = false;
      this.selectedDate = this.dateTimePickerEl.data('DateTimePicker').date().toDate();
      if (this.tempDate.getTime() !== this.selectedDate.getTime()) {
        this.onChange.emit({
          date: this.selectedDate
        });
        this.updateLabel();
      }
    });
  }

  ngOnChanges(changes: any) {
    // if range value was changed, then maxDate should be changed too
    if (changes.maxDate && changes.maxDate.currentValue !== changes.maxDate.previousValue) {
      if (this.dateTimePickerEl && this.dateTimePickerEl.data('DateTimePicker')) {
        this.dateTimePickerEl.data('DateTimePicker').maxDate(changes.maxDate.currentValue);
        // if range is equal to 1 day, then date is not calculated automatically
        // then change it manually
        if (!this.dateTimePickerEl.data('DateTimePicker').date()) {
          this.dateTimePickerEl.data('DateTimePicker').date(changes.maxDate.currentValue);
        }
        this.updateLabel();
      }
    }
  }

}

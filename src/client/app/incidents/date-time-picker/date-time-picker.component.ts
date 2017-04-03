import { Component, Input, Output, EventEmitter, ElementRef, ViewEncapsulation, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as moment from 'moment';
// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];
const labelFormat: string = 'MMM D';

@Component({
  moduleId: module.id,
  selector: 'date-time-picker-incidents',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: ['date-time-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncidentsDateTimePickerComponent implements OnInit, OnChanges {

  public selectedDate: Date;
  public dateTimePicker: any;
  public dateTimePickerEl: any;
  public isOpened: boolean = false;
  public label: string = 'Choose date';
  public tempDate: Date;
  // is used in ngOnChanges
  @Input() date: Date;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() range: number = 0;
  @Input() disabled: boolean;
  @Input() incidentsByYear: any;
  @Output() change = new EventEmitter();

  constructor(
    public elementRef: ElementRef
  ) { }

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
    this.dateTimePicker = this.dateTimePickerEl.datetimepicker({
      format: 'DD/MM/YYYY',
      minDate: this.minDate || false,
      maxDate: this.maxDate || false,
      keepOpen: false,
      icons: {
        next: 'icon-chevron-right',
        previous: 'icon-chevron-left'
      },
    });

    if (this.range !== 0) {
      this.refreshSelectedDate();
      this.updateLabel();
    }

    this.dateTimePickerEl.on('dp.show', () => {
      this.isOpened = true;
      this.tempDate = this.dateTimePickerEl.data('DateTimePicker').date().toDate();
      this.highlightNonEmptyDates();
    });

    this.dateTimePickerEl.on('dp.update', () => {
      this.highlightNonEmptyDates();
    });

    this.dateTimePickerEl.on('dp.hide', () => {
      this.isOpened = false;
      this.refreshSelectedDate();
      if (!!this.tempDate && !!this.selectedDate && (this.tempDate.getTime() !== this.selectedDate.getTime())) {
        this.change.emit({
          date: this.selectedDate
        });
        this.updateLabel();
      }
    });
  }

  refreshSelectedDate() {
    if (this.dateTimePickerEl.data('DateTimePicker').date()) {
      this.selectedDate = this.dateTimePickerEl.data('DateTimePicker').date().toDate();
    }
  }

  highlightNonEmptyDates() {
    if (this.incidentsByYear && this.dateTimePickerEl) {
      for (let dateStr in this.incidentsByYear) {
        if (this.incidentsByYear[dateStr] === true) {
          this.dateTimePickerEl.find('td[data-day="' + dateStr + '"]').addClass('rfcx-has-events');
        }
      }
    }
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
        this.refreshSelectedDate();
        this.change.emit({
          date: this.selectedDate
        });
        this.updateLabel();
      }
    }
    if (changes.incidentsByYear && changes.incidentsByYear.currentValue !== changes.incidentsByYear.previousValue) {
      this.highlightNonEmptyDates();
    }
    if (changes.date && changes.date.currentValue !== changes.date.previousValue && this.dateTimePickerEl &&
        changes.date.currentValue !== this.selectedDate) {
      this.dateTimePickerEl.data('DateTimePicker').date(changes.date.currentValue);
      this.refreshSelectedDate();
      this.updateLabel();
    }
  }

}

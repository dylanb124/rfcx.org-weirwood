import { Component, Input, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'incidents-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentsTableComponent implements OnInit, OnChanges {

  public labels: Array<string>;
  public labelsTotal: any;
  @Input() public data: Array<any>;

  ngOnInit() {
    this.parseData();
  }

  parseData() {
    this.getAllLabels();
    this.calculateTotalPerSector();
    this.calculateTotalPerLabel();
  }

  getAllLabels() {
    this.labels = [];
    this.data.forEach((item) => {
      Object.keys(item.events).forEach((label) => {
        if (this.labels.indexOf(label) === -1) {
          this.labels.push(label);
        }
      });
    });
  }

  calculateTotalPerSector() {
    this.data.forEach((item) => {
      item.total = (<any>Object).values(item.events).reduce((a: string, b: string) => {
        return parseInt(a) + parseInt(b);
      }, 0);
    });
  }

  calculateTotalPerLabel() {
    this.labelsTotal = {};
    this.labels.forEach((label) => {
      this.labelsTotal[label] = 0;
      this.data.forEach((item) => {
        if (item.events[label]) {
          this.labelsTotal[label] += item.events[label];
        }
      });
    });
    this.labelsTotal.total = 0;
    this.data.forEach((item) => {
      this.labelsTotal.total += item.total;
    });
  }

  ngOnChanges(changes: any) {
    if (changes.data && !changes.data.isFirstChange()) {
      this.parseData();
    }
  }
}

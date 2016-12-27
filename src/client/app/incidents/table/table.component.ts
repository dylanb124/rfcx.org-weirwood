import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'incidents-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentsTableComponent implements OnInit {

    // @Input() private data: Array<any>;
    private data: Array<any>;
    private labels: Array<string>;
    private labelsTotal: any;

    ngOnInit() {
        this.data = [
            {
                title: 'Forest Sector 1',
                incidents: {
                    chainsaws: 10,
                    shots: 10,
                    vehicles: 10
                }
            },
            {
                title: 'Forest Sector 2',
                incidents: {
                    chainsaws: 20,
                    shots: 20,
                    vehicles: 20
                }
            },
            {
                title: 'Forest Sector 3',
                incidents: {
                    chainsaws: 30,
                    shots: 30,
                    vehicles: 30
                }
            },
            {
                title: 'Forest Sector 4',
                incidents: {
                    chainsaws: 40,
                    shots: 40,
                    vehicles: 40
                }
            },
            {
                title: 'Forest Sector 5',
                incidents: {
                    chainsaws: 50,
                    shots: 50,
                    vehicles: 50
                }
            }
        ];
        this.getAllLabels();
        this.calculateTotalPerSector();
        this.calculateTotalPerLabel();
    }

    getAllLabels() {
        this.labels = [];
        this.data.forEach((item) => {
            Object.keys(item.incidents).forEach((label) => {
                if (this.labels.indexOf(label) === -1) {
                    this.labels.push(label);
                }
            });
        });
    }

    calculateTotalPerSector() {
        this.data.forEach((item) => {
            item.total = Object.values(item.incidents).reduce((a:string, b:string) => {
                return parseInt(a) + parseInt(b);
            }, 0);
        });
    }

    calculateTotalPerLabel() {
        this.labelsTotal = {};
        this.labels.forEach((label) => {
            this.labelsTotal[label] = 0;
            this.data.forEach((item) => {
                this.labelsTotal[label] += item.incidents[label];
            });
        });
        this.labelsTotal.total = 0;
        this.data.forEach((item) => {
            this.labelsTotal.total += item.total;
        });
    }
}

import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropdownCheckboxItem } from './dropdown-item';

// use this hack to get jQuery (as jQuery conflicts with protractor)
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'dropdown-checkboxes',
  templateUrl: 'dropdown-checkboxes.component.html',
  styleUrls: ['dropdown-checkboxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownCheckboxesComponent {

    // internal id for twitter bootstrap dropdown interaction
    private elementId:number = Math.round(Math.random() * 10000000);
    private currentItems: Array<DropdownCheckboxItem> = [];

    @Input() private title: string = 'Choose';
    @Input() private allItemsTitle: string;
    @Input() private items: Array<DropdownCheckboxItem> = [];
    @Input() private dropup: boolean = false;
    @Input() private disabled: boolean = false;
    @Input() private block: boolean = false;
    @Input() private download: boolean = false;
    @Input() private noborder: boolean = false;
    @Output() onChange = new EventEmitter();

    constructor() {}

    preventLinkClick(event: Event) {
        event.stopPropagation();
    }

    changeValue(event: Event, item:DropdownCheckboxItem) {
        event.stopPropagation();

        if (item.checked) {
            this.currentItems.push(item);
        }
        else {
            this.currentItems.splice(this.currentItems.indexOf(item), 1);
        }

        this.onChange.emit({
            items: this.currentItems
        });

        return false;
    }

    combineDropdownTitle() :string {
        if (!this.items.length) {
            return 'No Items';
        }
        if (!this.currentItems.length) {
            return this.title;
        }
        if (this.allItemsTitle && this.currentItems.length === this.items.length) {
            return this.allItemsTitle;
        }
        let labels = this.currentItems.map( (item) => {
            return item.label
        });
        return labels.join(', ');
    }

}

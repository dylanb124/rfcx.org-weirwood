import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropdownItem } from './dropdown-item';

@Component({
  moduleId: module.id,
  selector: 'dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent {

    // internal id for twitter bootstrap dropdown interaction
    private elementId:number = Math.round(Math.random() * 10000000);
    private currentItem: DropdownItem;

    @Input() private title: string = 'Choose';
    @Input() private items: Array<DropdownItem> = [];
    @Input() private dropup: boolean = false;
    @Input() private disabled: boolean = false;
    @Input() private block: boolean = false;
    @Input() private download: boolean = false;
    @Input() private noborder: boolean = false;
    @Output() onChange = new EventEmitter();

    constructor() {}

    changeValue(item:DropdownItem) {
        this.currentItem = item;
        this.onChange.emit({
            item: item
        });
    }

}

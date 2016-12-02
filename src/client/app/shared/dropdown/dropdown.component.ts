import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropdownItem } from './dropdown-item';

@Component({
  moduleId: module.id,
  selector: 'dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.css'],
})
export class DropdownComponent {

    // internal id for twitter bootstrap dropdown interaction
    private elementId:number = Math.round(Math.random() * 10000000);
    private currentItem: DropdownItem;

    @Input() private title: string = 'Choose';
    @Input() private items: Array<DropdownItem> = [];
    @Output() onChange = new EventEmitter();

    constructor() {}

    changeValue(item:DropdownItem) {
        this.currentItem = item;
        this.onChange.emit({
            item: item
        });
    }

}

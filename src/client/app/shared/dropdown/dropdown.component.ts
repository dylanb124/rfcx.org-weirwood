import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropdownItem } from './dropdown-item';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector-name
  selector: 'dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnInit {

  // tslint:disable-next-line:no-unused-variable
  @Output() onChange = new EventEmitter();
  // tslint:disable-next-line:no-unused-variable
  @Input() private title: string = 'Choose';
  // tslint:disable-next-line:no-unused-variable
  @Input() private items: Array<DropdownItem> = [];
  // tslint:disable-next-line:no-unused-variable
  @Input() private dropup: boolean = false;
  // tslint:disable-next-line:no-unused-variable
  @Input() private disabled: boolean = false;
  // tslint:disable-next-line:no-unused-variable
  @Input() private block: boolean = false;
  // tslint:disable-next-line:no-unused-variable
  @Input() private download: boolean = false;
  // tslint:disable-next-line:no-unused-variable
  @Input() private noborder: boolean = false;
  // internal id for twitter bootstrap dropdown interaction
  // tslint:disable-next-line:no-unused-variable
  private elementId: number = Math.round(Math.random() * 10000000);
  private currentItem: DropdownItem;

  ngOnInit() {
    let selectedItems = this.items.filter((item: DropdownItem) => {
      return item.selected === true;
    });
    if (selectedItems.length === 1) {
      this.currentItem = selectedItems[0];
    }
    if (selectedItems.length > 1) {
      console.error('You have selected more than one selected item for', module.id);
    }
  }

  changeValue(item: DropdownItem) {
    this.currentItem = item;
    this.onChange.emit({
      item: item
    });
  }

}

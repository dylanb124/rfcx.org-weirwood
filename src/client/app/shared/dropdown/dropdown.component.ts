import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropdownItem } from './dropdown-item';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnInit {

  @Output() onChange = new EventEmitter();
  @Input() title: string = 'Choose';
  @Input() items: Array<DropdownItem> = [];
  @Input() dropup: boolean = false;
  @Input() disabled: boolean = false;
  @Input() block: boolean = false;
  @Input() download: boolean = false;
  @Input() noborder: boolean = false;
  // internal id for twitter bootstrap dropdown interaction
  public elementId: number = Math.round(Math.random() * 10000000);
  public currentItem: DropdownItem;

  ngOnInit() {
    this.checkRequiredParams();
    let selectedItems = this.items.filter((item: DropdownItem) => {
      return item.selected === true;
    });
    if (selectedItems.length === 1) {
      this.currentItem = selectedItems[0];
    }
    if (selectedItems.length > 1) {
      throw new Error('You have selected more than one selected item for ' + module.id);
    }
  }

  checkRequiredParams() {
    if (this.items === undefined) throw new Error('"items" input is required for DropdownComponent');
  }

  changeValue(item: DropdownItem) {
    this.currentItem = item;
    this.onChange.emit({
      item: item
    });
  }

}

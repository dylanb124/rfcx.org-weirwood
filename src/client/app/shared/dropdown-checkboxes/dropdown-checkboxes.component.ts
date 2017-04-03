import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropdownCheckboxItem } from './dropdown-item';
import { FormsModule } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'dropdown-checkboxes',
  templateUrl: 'dropdown-checkboxes.component.html',
  styleUrls: ['dropdown-checkboxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownCheckboxesComponent implements OnInit {

  @Output() change = new EventEmitter();
  // internal id for twitter bootstrap dropdown interaction
  public elementId: number = Math.round(Math.random() * 10000000);
  public currentItems: Array<DropdownCheckboxItem> = [];
  @Input() title: string = 'Choose';
  @Input() allItemsTitle: string = 'All items';
  @Input() items: Array<DropdownCheckboxItem> = [];
  @Input() dropup: boolean = false;
  @Input() disabled: boolean = false;
  @Input() block: boolean = false;
  @Input() noborder: boolean = false;

  ngOnInit() {
    this.items.forEach((item: DropdownCheckboxItem) => {
      if (item.checked) {
        this.currentItems.push(item);
      }
    });
  }

  preventLinkClick(event: Event) {
    event.stopPropagation();
  }

  changeValue(event: Event, item: DropdownCheckboxItem) {
    event.stopPropagation();

    if (item.checked) {
      this.currentItems.push(item);
    }
    else {
      this.currentItems.splice(this.currentItems.indexOf(item), 1);
    }

    this.change.emit({
      items: this.currentItems
    });

    return false;
  }

  combineDropdownTitle(): string {
    if (!this.items.length) {
      return 'No items';
    }
    if (this.allItemsTitle && this.currentItems.length === this.items.length) {
      return this.allItemsTitle;
    }
    if (!this.currentItems.length) {
      return this.title;
    }
    let labels = this.currentItems.map((item) => {
      return item.label;
    });
    return labels.join(', ');
  }

}

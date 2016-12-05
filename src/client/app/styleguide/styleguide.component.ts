import { Component } from '@angular/core';

import { DropdownItem } from '../shared/dropdown/dropdown-item';

@Component({
  moduleId: module.id,
  selector: 'sd-styleguide',
  templateUrl: 'styleguide.component.html',
  styleUrls: ['styleguide.component.css'],
})

export class StyleguideComponent {

    public dropdownItems: Array<DropdownItem> = [
      {
        value: '_111_',
        label: 'SPSS.SAV'
      },
      {
        value: '_222_',
        label: 'Adobe.PDF'
      },
      {
        value: '_333_',
        label: 'OpenOffice.ODT'
      },
      {
        value: '_444_',
        label: 'Microsoft.XSLX'
      },
      {
        value: '_555_',
        label: 'Microsoft.DOCX'
      },
      {
        value: '_666_',
        label: 'Comma-separated.CSV'
      }
    ];

    dropDownChanged(event: any){
      console.log('dropDownChanged', event);
    }

}

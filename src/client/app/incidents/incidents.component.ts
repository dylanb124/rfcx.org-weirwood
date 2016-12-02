import { Component } from '@angular/core';

import { DropdownItem } from '../shared/dropdown/dropdown-item';

/**
 * This class represents the lazy loaded IncidentsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-incidents',
  templateUrl: 'incidents.component.html',
  styleUrls: ['incidents.component.css'],
})

export class IncidentsComponent {

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
      value: '_333_',
      label: 'Microsoft.XSLX'
    },
    {
      value: '_333_',
      label: 'Microsoft.DOCX'
    },
    {
      value: '_333_',
      label: 'Comma-separated.CSV'
    }
  ]

  dropDownChanged(event: any){
    console.log('dropDownChanged', event);
  }

}

import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent {

  @Input() public width:number;
  currentWidth:number = 32;
  transformStyle:any;

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.width) {
      this.currentWidth = this.width;
    }
    this.transformStyle = this.sanitizer.bypassSecurityTrustStyle('scale(0.' + this.currentWidth/2 +')');
  }

}

import { Component, Input, Output, Inject, forwardRef, ElementRef, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { RfcxMapComponent } from './rfcx-map.component';
import { rfcxMapIcon, rfcxMapRedIcon, rfcxRangerIcon, rfcxRangerGrayIcon } from './icon';
import { PulseOptions } from './pulse-options';

import * as L from 'leaflet';
import 'leaflet-polylinedecorator';
let jQuery: any = (window as any)['$'];

@Component({
  moduleId: module.id,
  selector: 'rfcx-map-marker',
  template: ''
})
export class RfcxMapMarkerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() lat: number;
  @Input() lon: number;
  @Input() pulseOpts?: PulseOptions;
  @Input() popupHtml: string;
  @Input() data: any;
  @Input() type: string;
  @Input() fadeOutTime?: number;
  @Output() onPlayClick = new EventEmitter();
  @Output() onArrowCreated = new EventEmitter();
  public rfcxMapComp: any;
  public marker: any;
  public icon: any;
  public popup: any;
  public path: any;
  public arrow: any;

  constructor(
    @Inject(forwardRef(() => RfcxMapComponent)) map: RfcxMapComponent,
    public element: ElementRef
  ) {
    this.rfcxMapComp = map;
  }

  ngOnInit() {
    this.defineIconType();
    this.appendToMap();
    if (this.popupHtml) {
      this.createPopup();
    }
    if (this.type === 'ranger') {
      this.bindArrowDraw();
    }
  }

  ngOnDestroy() {
    // if fadeOutTime specified, then delete item with fade effect
    if (this.fadeOutTime) {
      // this attribute is required for map component, so it ignores this item when wants to calculate new map bounds
      this.marker.options.isDeleting = true;
      jQuery(this.marker._icon).fadeOut(this.fadeOutTime, () => {
        this.removeFromMap();
      });
    }
    else {
      this.removeFromMap();
    }
  }

  ngOnChanges(changes: any) {
    if (changes.pulseOpts && !changes.pulseOpts.isFirstChange()) {
      this.updatePulse();
    }
  }

  defineIconType() {
    switch (this.type) {
      case 'danger':
        this.icon = rfcxMapRedIcon;
        break;
      case 'ranger':
        this.icon = rfcxRangerIcon;
        break;
      case 'ranger-ghost':
        this.icon = rfcxRangerGrayIcon;
        break;
      case 'default':
      default:
        this.icon = rfcxMapIcon;
    }
  }

  appendToMap() {
    this.marker = L.marker([this.lat, this.lon], { icon: this.icon });
    this.marker.addTo(this.rfcxMapComp.rfcxMap);
    // if maker is pulsated, then append pulse css class to it's icon
    this.updatePulse();
  }

  removeFromMap() {
    this.rfcxMapComp.rfcxMap.removeLayer(this.marker);
    if (this.popup) {
      this.rfcxMapComp.rfcxMap.closePopup();
    }
    this.removeArrow();
  }

  bindAdditionalEvents() {
    if (this.onPlayClick) {
      jQuery(this.popup.getElement()).find('.js-tip-btn').click(() => {
        this.emitPlayBtnEvent();
      });
    }
  }

  updatePulse() {
    if (this.pulseOpts) {
      jQuery(this.marker._icon).css('color', this.pulseOpts.shadowColor);
      jQuery(this.marker._icon).addClass('pulse pulse-' + this.pulseOpts.type);
      // and remove that class after specified time
      if (this.pulseOpts.duration) {
        setTimeout(() => {
          jQuery(this.marker._icon).removeClass('pulse');
        }, this.pulseOpts.duration);
      }
    }
    else {
      jQuery(this.marker._icon).removeClass('pulse');
    }
  }

  createPopup() {
    let self = this;
    this.popup = L.popup({ className: 'd3-tip n' })
      .setLatLng([this.lat, this.lon])
      .setContent(() => { return this.popupHtml; });
    this.marker.bindPopup(this.popup);
    this.marker.on('click', function () {
      this.openPopup();
      self.bindAdditionalEvents();
    });
  }

  bindArrowDraw() {
    let self = this;
    this.marker.on('mousedown', function (event: any) {
      self.rfcxMapComp.rfcxMap.dragging.disable();
      self.rfcxMapComp.rfcxMap.on('mousemove', self.onMouseMove, self);
      self.rfcxMapComp.rfcxMap.on('mouseup', self.onMouseUp, self);
      self.createOrUpdateArrow({
        from: event.latlng
      });
    });
  }

  onMouseUp(event: any) {
    this.rfcxMapComp.rfcxMap.off('mousemove', this.onMouseMove, this);
    this.rfcxMapComp.rfcxMap.off('mouseup', this.onMouseUp, this);
    this.rfcxMapComp.rfcxMap.dragging.enable();
    this.emitArrowCreatedEvent(event.latlng);
  }

  onMouseMove(event: any) {
    this.createOrUpdateArrow({
      to: event.latlng
    });
  }

  createOrUpdateArrow(opts: any) {
    if (!this.path) {
      this.createArrow(opts);
    }
    else {
      if (!opts.to) {
        return;
      }
      this.path.setLatLngs([this.path.getLatLngs()[0], opts.to]);
      this.arrow.setPaths([this.path.getLatLngs()[0], opts.to]);
    }
  }

  createArrow(opts: any) {
    let color = '#ff4155';
    this.path = L.polyline([opts.from, opts.from], {
      color: color,
      weight: 4
    });
    this.arrow = (<any>L).polylineDecorator(this.path, {
      patterns: [
        {
          offset: '100%',
          repeat: 0,
          symbol: (<any>L).Symbol.arrowHead({
            headAngle: 45,
            pixelSize: 16,
            pathOptions: {
              fillOpacity: 1,
              color: color,
              weight: 2
            }
          })
        }
      ]
    });
    this.path.addTo(this.rfcxMapComp.rfcxMap);
    this.arrow.addTo(this.rfcxMapComp.rfcxMap);
  }

  removeArrow() {
    if (this.path) {
      this.rfcxMapComp.rfcxMap.removeLayer(this.path);
    }
  }

  emitPlayBtnEvent() {
    this.onPlayClick.emit({
      audioGuid: this.data.audioGuid,
      autoplay: true,
      streamTitle: this.data.shortname + ', ' + this.data.site
    });
  }

  emitArrowCreatedEvent(coords: any) {
    this.onArrowCreated.emit({
      guid: this.data.guid,
      coords: {
        lat: coords.lat,
        lon: coords.lng
      }
    });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { AudioService } from '../services/audio.service';

import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'rfcx-streamer',
  templateUrl: 'rfcx-streamer.component.html',
  styleUrls: ['rfcx-streamer.component.css'],
})
export class RfcxStreamerComponent implements OnInit {

  public isPlaying: boolean = false;
  @Input() audioGuid: string;

  constructor(
    public audioService: AudioService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.audioService.getAudioByGuid({
      guid: this.audioGuid
    })
    .subscribe(
      data => {
        console.log('audio', data);
      },
      err => console.log('Error loading audio', err)
    );
  }

}

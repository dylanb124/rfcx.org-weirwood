import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '../services/audio.service';

import * as moment from 'moment';
import 'moment-timezone';

@Component({
  moduleId: module.id,
  selector: 'rfcx-streamer',
  templateUrl: 'rfcx-streamer.component.html',
  styleUrls: ['rfcx-streamer.component.css'],
})
export class RfcxStreamerComponent implements OnInit, OnDestroy {

  public isPlaying: boolean = false;
  public audioList: Array<any> = [];
  public currentIndex: number = 0;
  public format: string = 'mp3';
  public requestAnimFrame: Function;
  public audioContext: any;
  public context: any;
  public analyserLeftChannel: any;
  public analyserRightChannel: any;
  public amplitudeArray: Uint8Array;
  public frequencyArray: Uint8Array;

  public labelTime: string;
  @Input() audioGuid: string;
  @Input() autoplay: boolean;
  @Input() loadNext: boolean;
  @Input() title: string;
  @Output() onAudioStarted = new EventEmitter();
  @Output() onAudioPaused = new EventEmitter();
  @Output() onAudioEnded = new EventEmitter();

  constructor(
    public audioService: AudioService,
  ) { }

  ngOnInit() {
    this.defineAudioConstructors();
    this.initAudioParsers();
    this.loadData()
      .subscribe(
        data => {
          if (this.autoplay) {
            this.play();
          }
        }
      );
  }

  ngOnDestroy() {
    this.pause();
    if (this.context.close) {
      this.context.close();
    }
  }

  loadData(opts?: any) {
    let observ;
    if (opts && !!opts.next && !!opts.guid) {
      observ = this.audioService.getNextAudioByGuid({
        guid: opts.guid
      });
    }
    else {
      observ = this.audioService.getAudioByGuid({
        guid: this.audioGuid
      });
    }

    observ.subscribe(
      data => {
        console.log('audio', data);
        if (!this.doesAudioExist(data[0])) {
          this.audioList.push({
            audio: this.createAudio(data[0]),
            data: data[0]
          });
          this.updateLoopAttr();
        }
        console.log('audioList', this.audioList);
      },
      err => console.log('Error loading audio', err)
    );
    return observ;
  }

  doesAudioExist(data: any) {
    return !!this.audioList.find((item: any) => {
      return item.guid === data.guid;
    });
  }

  updateLoopAttr() {
    this.audioList.forEach((item) => {
      item.audio.loop = false;
    });
    this.audioList[this.audioList.length - 1].loop = true;
  }

  defineAudioConstructors() {
      this.requestAnimFrame = (function() {
        return (<any>window).requestAnimationFrame  ||
          (<any>window).webkitRequestAnimationFrame ||
          (<any>window).mozRequestAnimationFrame    ||
          function(callback: Function){
            window.setTimeout(callback, 1000 / 60);
          };
      })();
      this.audioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext || (<any>window).mozAudioContext;
    };

  initAudioParsers() {
      this.context  = new this.audioContext();
      this.analyserLeftChannel = this.context.createAnalyser();
      this.analyserRightChannel = this.context.createAnalyser();
      // bars animation smoothlng
      this.analyserLeftChannel.smoothingTimeConstant = 0.2;
      this.analyserRightChannel.smoothingTimeConstant = 0.2;
      // the size of the FFT (Fast Fourier Transform) to be used to determine the frequency domain
      this.analyserLeftChannel.fftSize = 4096;
      this.analyserRightChannel.fftSize = 4096;

      this.amplitudeArray = new Uint8Array(this.analyserLeftChannel.frequencyBinCount);
      this.frequencyArray = new Uint8Array(this.analyserLeftChannel.frequencyBinCount);

      this.analyserLeftChannel.connect(this.context.destination);
      this.analyserRightChannel.connect(this.context.destination);

      // store scriptprocessor in global scope to avoid it being garbage collected
      (<any>window).javascriptNode = this.context.createScriptProcessor(1024, 1, 1);
      // (<any>window).javascriptNode.onaudioprocess = this._onAudioProcess;
      (<any>window).javascriptNode.connect(this.context.destination);
    };

  createAudio(data: any) {
    let audio = new Audio();
    audio.src = data.urls[this.format];
    audio.loop = false;
    // to allow analysing audio from foreign server
    audio.crossOrigin  = 'anonymous';
    audio.onended      = this._onAudioEnded.bind(this);
    audio.ontimeupdate = this._onAudioTimeUpdate.bind(this);
    var source = this.context.createMediaElementSource(audio);
    // create audio splitter to play both audio channels but render graphs only for left channel
    let splitter = this.context.createChannelSplitter();
    source.connect(splitter);
    splitter.connect(this.analyserLeftChannel,0,0);
    splitter.connect(this.analyserRightChannel,1,0);
    this.analyserLeftChannel.connect((<any>window).javascriptNode);
    return audio;
  }

  play() {
    this.audioList[this.currentIndex].audio.play();
    console.log('playing', this.currentIndex+1, 'audio');
    this.isPlaying = true;
    if (this.onAudioStarted) {
      this.onAudioStarted.emit();
    }
  }

  pause() {
    this.audioList[this.currentIndex].audio.pause();
    this.isPlaying = false;
    if (this.onAudioPaused) {
      this.onAudioPaused.emit();
    }
  }

  // _onAudioProcess() {}

  _onAudioEnded() {
    if (this.currentIndex + 1 < this.audioList.length) {
      this.currentIndex++;
      this.play();
    }
    else {
      this.isPlaying = false;
      this.labelTime = undefined;
      if (this.onAudioEnded) {
        this.onAudioEnded.emit();
      }
    }
  }

  _onAudioTimeUpdate(event: any) {
    let time = parseInt(event.target.currentTime);
    let audioData = this.audioList[this.currentIndex].data;
    this.labelTime = moment.tz(audioData.measured_at, audioData.timezone).add(time, 'seconds').format('HH:mm:ss');
    let percPlayed = Math.round((time * 1000) / audioData.duration * 100);
    // request new audio file if user played 10% of file, or audio data has zero duration
    if (!!this.loadNext && !audioData.isNextFileRequested && (audioData.duration === 0 || percPlayed > 50)) {
      this.loadData({
        next: true,
        guid: audioData.guid
      });
      audioData.isNextFileRequested = true;
    }
  }

}

import { Injectable } from '@angular/core';

@Injectable()
export class AudioNotifier {

  private alertAudio: any;

  constructor() {
    this.createAudio();
  }

  private createAudio() {
    this.alertAudio = new Audio();
    this.alertAudio.src = '/assets/mp3/alert.mp3';
    this.alertAudio.load();
  }

  alert() {
    this.alertAudio.play();
  }

}

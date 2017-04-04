import { Injectable } from '@angular/core';

@Injectable()
export class AudioNotifier {

  private alertAudio: any;

  constructor() {
    this.createAudio();
  }

  alert() {
    this.alertAudio.play();
  }

  private createAudio() {
    this.alertAudio = new Audio();
    this.alertAudio.src = '/assets/mp3/alert.mp3';
    this.alertAudio.load();
  }

}

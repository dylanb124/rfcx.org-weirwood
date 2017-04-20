import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

import * as moment from 'moment';

@Injectable()
export class MessageService {

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) { }

  sendMessage(opts: any) {
    let body: any = {
      type: 'ranger-warning',
      time: moment().toISOString()
    }
    if (opts.coords) {
      body.latitude = opts.coords.latitude;
      body.longitude = opts.coords.longitude;
    }
    if (opts.text) {
      body.text = opts.text;
    }
    if (opts.userTo) {
      body.userTo = opts.userTo;
    }

    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token'),
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.post(Config.API + 'messages', JSON.stringify(body), options)
                    .map((res) => res.json())
                    .share();
  }

}

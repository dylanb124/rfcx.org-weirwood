import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

@Injectable()
export class AudioService {

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) { }

  getAudioByGuid(opts: any) {
    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.get(Config.API + 'audio/' + opts.guid, options)
                    .map((res) => res.json())
                    .share();
  }

  getAudioByGuardian(opts: any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('starting_after', opts.starting_after);
    params.set('ending_before', opts.ending_before);

    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers,
      search: params
    });

    return this.http.get(Config.API + 'guardians/' + opts.guid + '/audio.json', options)
                    .map((res) => res.json())
                    .share();
  }

}

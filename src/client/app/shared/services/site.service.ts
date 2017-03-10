import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

@Injectable()
export class SiteService {

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) { }

  getSites() {
    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.get(Config.API + 'sites', options)
                    .map((res) => res.json())
                    .share();
  }

}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { CookieService } from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

@Injectable()
export class GuardianService {

  constructor(
    private http: Http,
    private cookieService: CookieService,
  ) { }

  getGuardians(opts?: any) {
    let headers = new Headers({
      'x-auth-user': 'user/' + this.cookieService.get('guid'),
      'x-auth-token': this.cookieService.get('token')
    });
    let options = new RequestOptions({
      headers: headers,
      search: opts.search || {}
    });

    return this.http.get(Config.API + 'guardians', options)
                    .map((res) => res.json())
                    .share();
  }

}

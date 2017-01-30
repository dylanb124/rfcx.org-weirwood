import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

@Injectable()
export class UserService {

  constructor(
    private http: Http,
    private cookieService: CookieService,
    private router: Router
  ) { }

  logIn(email: string, password: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let request = this.http
      .post(
      Config.API + 'users/login',
      JSON.stringify({ email, password }),
      options
      );
    request.subscribe(
      (res) => {
        let body = res.json();
        if (body) {
          // response is wrapped in array
          body = body[0];
          this.saveCookies({
            guid: body.guid,
            token: body.tokens[0].token,
            expires: body.tokens[0].token_expires_at,
            firstname: body.firstname || 'RFCx',
            lastname: body.lastname || 'user',
            username: body.username || 'user@rfcx.org'
          });
          this.router.navigate(['/incidents']);
        }
      },
      (error) => {
        if (error) {
          let errBody = error.json();
          if (errBody && errBody.message) {
            console.log('Error', errBody);
          }
        }
      }
    );
    return request;
  }

  logOut(): void {
    this.cookieService.remove('guid');
    this.cookieService.remove('token');
    this.cookieService.remove('firstname');
    this.cookieService.remove('lastname');
    this.cookieService.remove('username');
    this.router.navigate(['/login']);
  }

  saveCookies(opts: any): void {
    this.cookieService.put('guid', opts.guid, { expires: opts.expires });
    this.cookieService.put('token', opts.token, { expires: opts.expires });
    this.cookieService.put('firstname', opts.firstname, { expires: opts.expires });
    this.cookieService.put('lastname', opts.lastname, { expires: opts.expires });
    this.cookieService.put('username', opts.username, { expires: opts.expires });
  }

  areCookiesExist(): boolean {
    return !!this.cookieService.get('token') && !!this.cookieService.get('guid');
  }

  isLoggedIn(): boolean {
    return this.areCookiesExist();
  }

  getUserData() {
    return {
      firstname: this.cookieService.get('firstname'),
      lastname: this.cookieService.get('lastname'),
      username: this.cookieService.get('username')
    };
  }
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { CookieService }  from 'angular2-cookie/core';
import { Config } from '../config/env.config.js';

@Injectable()
export class UserService {

    constructor(
        private http: Http,
        private cookieService: CookieService,
        private router: Router
    ) {}

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
                    this.saveCookies(body.guid, body.tokens[0].token, body.tokens[0].token_expires_at);
                    this.router.navigate(['/incidents']);
                }
            },
            (error) =>  {
                if (error) {
                    let errBody = error.json();
                    if (errBody && errBody.message) {
                        // alert(errBody.message);
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
        this.router.navigate(['/login']);
    }

    saveCookies(guid: string, token: string, expires: string): void {
        this.cookieService.put('token', token, { expires: expires });
        this.cookieService.put('guid', guid, { expires: expires });
    }

    areCookiesExist(): boolean {
        return !!this.cookieService.get('token') && !!this.cookieService.get('guid');
    }

    isLoggedIn(): boolean {
        return this.areCookiesExist();
    }
}

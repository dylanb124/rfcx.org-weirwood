import { TestBed, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { Http, Headers, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';
import { Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/core';
import { ErrorResponse } from '../testing/helpers';


export function main() {

  let mockRouter = {
    navigate: () => { return true; }
  };
  let mockHttp = {
    post: () => {
      return;
    }
  };
  let spyRouter;

  describe('UserService', () => {
    let service: UserService;
    let spyRouter: any;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: Router, useValue: mockRouter },
          {
            provide: Http, useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
              return new Http(mockBackend, options);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          MockBackend,
          BaseRequestOptions,
          UserService,
          CookieService
        ]
      });
    });

    it('should send request, call cookieService method and navigate to incidents url after success',
        inject([UserService, MockBackend, CookieService, Router],
          (userService: UserService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        let spyCookie = spyOn(userService, 'saveCookies').and.returnValue(true);

        const mockResponse = [{
          guid: 'userguid',
          tokens: [{
            token: 'asdfghjkl',
            token_expires_at: '2015-09-12 16:55:15.000'
          }]
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        userService.logIn('asd@asd.com', 'asd')
        .subscribe((res: any) => {
          let body = res.json();
          expect(body).toEqual(mockResponse);
          expect(spyCookie.calls.count()).toEqual(1);
          expect(spyCookie.calls.first().args[0]).toEqual({
            guid: 'userguid',
            token: 'asdfghjkl',
            expires: '2015-09-12 16:55:15.000',
            firstname: 'RFCx',
            lastname: 'user',
            username: 'user@rfcx.org'
          });
          expect(spyRouter.calls.count()).toEqual(1);
          expect(spyRouter.calls.first().args[0]).toEqual(['/incidents']);
        });

    }));

    it('should send request, call cookieService method and navigate to incidents url after success with full params',
        inject([UserService, MockBackend, CookieService, Router],
          (userService: UserService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        let spyCookie = spyOn(userService, 'saveCookies').and.returnValue(true);

        const mockResponse = [{
          guid: 'userguid',
          firstname: 'John',
          lastname: 'Doe',
          username: 'john-doe',
          tokens: [{
            token: 'asdfghjkl',
            token_expires_at: '2015-09-12 16:55:15.000'
          }]
        }];

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        userService.logIn('asd@asd.com', 'asd')
        .subscribe((res: any) => {
          let body = res.json();
          expect(body).toEqual(mockResponse);
          expect(spyCookie.calls.count()).toEqual(1);
          expect(spyCookie.calls.first().args[0]).toEqual({
            guid: 'userguid',
            token: 'asdfghjkl',
            expires: '2015-09-12 16:55:15.000',
            firstname: 'John',
            lastname: 'Doe',
            username: 'john-doe'
          });
          expect(spyRouter.calls.count()).toEqual(1);
          expect(spyRouter.calls.first().args[0]).toEqual(['/incidents']);
        });

    }));

    it('should send request and do nothing if body is null',
        inject([UserService, MockBackend, CookieService, Router],
          (userService: UserService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        let spyCookie = spyOn(userService, 'saveCookies').and.returnValue(true);

        const mockResponse: any = null;

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        userService.logIn('asd@asd.com', 'asd')
        .subscribe((res: any) => {
          let body = res.json();
          expect(body).toEqual(mockResponse);
          expect(spyCookie.calls.count()).toEqual(0);
          expect(spyRouter.calls.count()).toEqual(0);
        });

    }));

    it('should send request and handle error',
        inject([UserService, MockBackend, CookieService, Router],
          (userService: UserService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        let spyCookie = spyOn(userService, 'saveCookies').and.returnValue(true);

        const mockResponse: any = {
          name: 'some',
          message: 'hello'
        };

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new ErrorResponse(new ResponseOptions({
            body: JSON.stringify(mockResponse),
            status: 401
          })));
        });

        userService.logIn('asd@asd.com', 'asd')
        .subscribe((res: any) => { return true; }, (err) => {
          let body = err.json();
          expect(body.name).toEqual('some');
          expect(body.message).toEqual('hello');
        });

    }));

    it('should send request and handle error witn empty message',
        inject([UserService, MockBackend, CookieService, Router],
          (userService: UserService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        let spyCookie = spyOn(userService, 'saveCookies').and.returnValue(true);

        const mockResponse: any = {
          name: 'some',
          message: undefined
        };

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new ErrorResponse(new ResponseOptions({
            body: JSON.stringify(mockResponse),
            status: 401
          })));
        });

        userService.logIn('asd@asd.com', 'asd')
        .subscribe((res: any) => { return true; }, (err) => {
          let body = err.json();
          expect(body.message).toEqual(undefined);
        });

    }));

    it('should call cookieService remove method 5 times with proper args and navigate to login on logOut method',
        inject([UserService, CookieService, Router],
          (userService: UserService, сookieService: CookieService, router: Router) => {

        let spyCookie = spyOn(сookieService, 'remove').and.returnValue(true);
        let spyRouter = spyOn(router, 'navigate').and.returnValue(true);

        userService.logOut();
        expect(spyCookie.calls.count()).toEqual(5);
        expect(spyCookie.calls.allArgs()).toEqual([['guid'], ['token'], ['firstname'], ['lastname'], ['username']]);
        expect(spyRouter.calls.count()).toEqual(1);
        expect(spyRouter.calls.first().args[0]).toEqual(['/login']);
    }));

    it('should call cookieService put method 5 times with proper args on saveCookies method',
        inject([UserService, CookieService],
          (userService: UserService, сookieService: CookieService, router: Router) => {

        let spyCookie = spyOn(сookieService, 'put').and.returnValue(true);
        const opts: any = {
          guid: '111',
          token: '222',
          firstname: '333',
          lastname: '444',
          username: '555',
          expires: '666'
        };

        userService.saveCookies(opts);
        expect(spyCookie.calls.count()).toEqual(5);
        expect(spyCookie.calls.allArgs()).toEqual([
          ['guid', '111', { expires: '666' }],
          ['token', '222', { expires: '666' }],
          ['firstname', '333', { expires: '666' }],
          ['lastname', '444', { expires: '666' }],
          ['username', '555', { expires: '666' }]
        ]);
    }));

    describe('areCookiesExist method', () => {

      it('should call CookieService get method with guid and token params and return true',
        inject([UserService, CookieService],
          (userService: UserService, сookieService: CookieService) => {

        let spyCookie = spyOn(сookieService, 'get').and.returnValue(true);

        let res = userService.areCookiesExist();
        expect(res).toEqual(true);
        expect(spyCookie.calls.count()).toEqual(2);
        expect(spyCookie.calls.allArgs()).toEqual([
          ['token'],
          ['guid']
        ]);
      }));

      it('should call CookieService get method with guid and token params and return false',
        inject([UserService, CookieService],
          (userService: UserService, сookieService: CookieService) => {

        let spyCookie = spyOn(сookieService, 'get').and.callFake((str: string) => {
          if (str === 'guid') return false;
          if (str === 'token') return true;
          return true;
        });

        let res = userService.areCookiesExist();
        expect(res).toEqual(false);
        expect(spyCookie.calls.count()).toEqual(2);
        expect(spyCookie.calls.allArgs()).toEqual([
          ['token'],
          ['guid']
        ]);
      }));

      it('should call CookieService get method with guid and token params and return false 2',
        inject([UserService, CookieService],
          (userService: UserService, сookieService: CookieService) => {

        let spyCookie = spyOn(сookieService, 'get').and.callFake((str: string) => {
          if (str === 'guid') return true;
          if (str === 'token') return false;
          return true;
        });

        let res = userService.areCookiesExist();
        expect(res).toEqual(false);
        expect(spyCookie.calls.count()).toEqual(1);
        expect(spyCookie.calls.first().args[0]).toEqual('token');
      }));

    });

    it('should call areCookiesExist on isLoggedIn call',
      inject([UserService], (userService: UserService) => {

      let spyCookie = spyOn(userService, 'areCookiesExist').and.returnValue(true);

      userService.isLoggedIn();
      expect(spyCookie.calls.count()).toEqual(1);
    }));

    it('should call CookieService get method 3 times and return object with results on getUserData call',
      inject([UserService, CookieService], (userService: UserService, сookieService: CookieService) => {

      let spyCookie = spyOn(сookieService, 'get').and.callFake((str: string) => {
          if (str === 'firstname') return 'John';
          if (str === 'lastname') return 'Doe';
          if (str === 'username') return 'john-doe';
          return '';
        });

      let res = userService.getUserData();
      expect(spyCookie.calls.count()).toEqual(3);
      expect(spyCookie.calls.allArgs()).toEqual([
          ['firstname'],
          ['lastname'],
          ['username']
        ]);
      expect(res).toEqual({firstname: 'John', lastname: 'Doe', username: 'john-doe'});
    }));

  });
}

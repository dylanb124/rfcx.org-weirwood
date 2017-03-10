import { TestBed, inject } from '@angular/core/testing';
import { SiteService } from './site.service';
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

  describe('SiteService', () => {
    let service: SiteService;
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
          SiteService,
          CookieService
        ]
      });
    });

    it('should create request and return it',
        inject([SiteService, MockBackend, CookieService, Router],
          (siteService: SiteService, mockBackend: MockBackend, cookieService: CookieService, router: Router) => {

        // let spyRouter = spyOn(router, 'navigate').and.returnValue(true);
        // let spyGetSites = spyOn(siteService, 'getSites').and.returnValue(true);

        const mockResponse = {
          aaa: 'bbb'
        };

        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        siteService.getSites()
          .subscribe((res: any) => {
            expect(res).toEqual(mockResponse);
            // expect(spyCookie.calls.count()).toEqual(1);
            // expect(spyCookie.calls.first().args[0]).toEqual({
            //   guid: 'userguid',
            //   token: 'asdfghjkl',
            //   expires: '2015-09-12 16:55:15.000',
            //   firstname: 'RFCx',
            //   lastname: 'user',
            //   username: 'user@rfcx.org'
            // });
            // expect(spyRouter.calls.count()).toEqual(1);
            // expect(spyRouter.calls.first().args[0]).toEqual(['/incidents']);
          });

    }));

  });

}

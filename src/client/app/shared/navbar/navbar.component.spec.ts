import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { RouterLinkStubDirective } from '../testing/mocks/routes';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export function main() {

  describe('Navbar Component', () => {

    let comp: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let spyUserLogout: any, spyRouter: any;

    let mockRouter = {
      isActive: () => { return true; }
    };
    let mockUser = {
      getUserData: () => { return { aa: 'bb' }; },
      logOut: () => { return true; }
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [NavbarComponent, RouterLinkStubDirective],
        providers: [
          { provide: Router, useValue: mockRouter },
          { provide: UserService, useValue: mockUser }
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      comp = fixture.componentInstance;
      spyUserLogout = spyOn(comp.userService, 'logOut').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should get user data from userService', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.userData).toEqual({aa: 'bb'});
        });
    });

    it('should call logOut method of UserService on logOut call', () => {
      TestBed
        .compileComponents()
        .then(() => {
          comp.logOut();
          expect(spyUserLogout.calls.count()).toEqual(1);
        });
    });

    it('should call isActive method of router with params on isRouteActive call', () => {
      TestBed
        .compileComponents()
        .then(() => {
          spyRouter = spyOn(comp.router, 'isActive').and.returnValue(true);
          comp.isRouteActive('asd');
          expect(spyRouter.calls.count()).toEqual(1);
          expect(spyRouter.calls.first().args).toEqual(['asd', true]);
        });
    });

  });
}

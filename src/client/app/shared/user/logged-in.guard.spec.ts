import { LoggedInGuard } from './logged-in.guard';
import { TestBed, inject } from '@angular/core/testing';
import { Router, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

export function main() {

  let mockRouter = {
    navigate: () => { return true; }
  };
  let mockSnapshot = {};
  let mockState = {};
  let mockUser = {
    isLoggedIn: () => { return false; }
  };

  describe('LoggedInGuard', () => {
    let service: LoggedInGuard;
    let userObj: UserService;
    // let routerObj: Router;
    let snapObj: ActivatedRouteSnapshot;
    let stateObj: RouterStateSnapshot;
    let spyRouter: any;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRouteSnapshot, useValue: mockSnapshot},
          { provide: RouterStateSnapshot, useValue: mockState },
          { provide: UserService, useValue: mockUser }
        ]
      });
    });

    beforeEach(inject([Router, UserService, ActivatedRouteSnapshot, RouterStateSnapshot],
      (router: Router, user: UserService, snap: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      userObj = user;
      // routerObj = router;
      snapObj = snap;
      stateObj = state;
      spyRouter = spyOn(router, 'navigate').and.callFake(() => { return true; });
      service = new LoggedInGuard(router, user);
    }));

    it('should navigate to login route and return false', () => {
      stateObj.url = '/some';
      spyOn(userObj, 'isLoggedIn').and.returnValue(false);
      let res = service.canActivate(snapObj, stateObj);
      expect(spyRouter.calls.count()).toEqual(1);
      expect(spyRouter.calls.first().args[0]).toEqual(['/login']);
      expect(res).toEqual(false);
    });

    it('should navigate to incidents route and return false', () => {
      stateObj.url = '/login';
      spyOn(userObj, 'isLoggedIn').and.returnValue(true);
      let res = service.canActivate(snapObj, stateObj);
      expect(spyRouter.calls.count()).toEqual(1);
      expect(spyRouter.calls.first().args[0]).toEqual(['/incidents']);
      expect(res).toEqual(false);
    });

    it('should return true', () => {
      stateObj.url = '/newurl';
      spyOn(userObj, 'isLoggedIn').and.returnValue(true);
      let res = service.canActivate(snapObj, stateObj);
      expect(spyRouter.calls.count()).toEqual(0);
      expect(res).toEqual(true);
    });

  });

}

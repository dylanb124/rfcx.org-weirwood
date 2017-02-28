import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { FormsModule } from '@angular/forms';
import { Response, ResponseOptions } from '@angular/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { UserService } from '../shared/user/user.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

let jQuery: any = (window as any)['$'];

export function main() {

  describe('Login Component', () => {

    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let expectedData: Array<any>;

    let mockUser = {
      logIn: () => {
        return {
          subscribe: (success: Function, error: Function) => {
            success();
          }
        };
      }
    };

    // async beforeEach
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [LoginComponent, SpinnerComponent],
        providers: [
          { provide: UserService, useValue: mockUser }
        ]
      })
        .compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize component variables', () => {
      TestBed
        .compileComponents()
        .then(() => {
          expect(comp.isLoading).toEqual(false);
          expect(comp.login.email).toEqual('');
          expect(comp.login.password).toEqual('');
          expect(comp.message).toEqual(null);
        });
    });

    it('should set message to null on onKey call', () => {
      comp.message = 'asd';
      TestBed
        .compileComponents()
        .then(() => {
          comp.onKey();
          expect(comp.message).toEqual(null);
        });
    });

    describe('onFinally method', () => {

      it('should set isLoading to false and message to null on onFinally call with null', () => {
        TestBed
          .compileComponents()
          .then(() => {
            comp.onFinally(null);
            expect(comp.isLoading).toEqual(false);
            expect(comp.message).toEqual(null);
          });
      });

      it('should set message to `Error in process of login.` on onFinally call with empty error', () => {
        let resp = new Response(new ResponseOptions({
          body: {}
        }));
        TestBed
          .compileComponents()
          .then(() => {
            comp.onFinally(resp);
            expect(comp.message).toEqual('Error in process of login.');
          });
      });

      it('should set message to `hello` on onFinally call with error', () => {
        let resp = new Response(new ResponseOptions({
          body: { message: 'hello' }
        }));
        TestBed
          .compileComponents()
          .then(() => {
            comp.onFinally(resp);
            expect(comp.message).toEqual('hello');
          });
      });

    });

    describe('onSubmit method', () => {

      let spyFinally: any;

      beforeEach(() => {
        spyFinally = spyOn(comp, 'onFinally').and.returnValue(true);
      });

      it('should call logIn of UserService and call onFinally with null on success', () => {
        let spyUser = spyOn(comp.userService, 'logIn').and.callThrough();
        TestBed
          .compileComponents()
          .then(() => {
            comp.onSubmit();
            expect(spyUser.calls.count()).toEqual(1);
            expect(spyFinally.calls.count()).toEqual(1);
            expect(spyFinally.calls.first().args[0]).toEqual(null);
          });
      });

      it('should call logIn of UserService and call onFinally with err on success', () => {
        let spyUser = spyOn(comp.userService, 'logIn').and.returnValue({
            subscribe: (success: Function, error: Function) => {
              error({some: 'error'});
            }
        });
        TestBed
          .compileComponents()
          .then(() => {
            comp.onSubmit();
            expect(spyUser.calls.count()).toEqual(1);
            expect(spyFinally.calls.count()).toEqual(1);
            expect(spyFinally.calls.first().args[0]).toEqual({some: 'error'});
          });
      });

      it('should set isLoading to true on onSubmit call', () => {
        let spyUser = spyOn(comp.userService, 'logIn').and.returnValue({
            subscribe: (success: Function, error: Function) => {
              return true;
            }
        });
        TestBed
          .compileComponents()
          .then(() => {
            comp.onSubmit();
            expect(comp.isLoading).toEqual(true);
          });
      });

    });

  });

}

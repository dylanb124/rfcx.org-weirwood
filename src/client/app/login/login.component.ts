import { Component } from '@angular/core';
import { Response } from '@angular/http';

import { UserService } from '../shared/user/user.service';

class LoginData {
  email: string;
  password: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {

  isLoading: boolean = false;
  login: LoginData = {
    email: '',
    password: ''
  };
  message: string = null;

  constructor(
    public userService: UserService
  ) { }

  onKey() {
    // reset error message when user started to edit data
    this.message = null;
  }

  onFinally(err: Response) {
    this.isLoading = false;
    this.message = null;
    if (err) {
      let error = err.json();
      this.message = error.message || 'Error in process of login.';
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.userService
      .logIn(this.login.email, this.login.password)
      .subscribe(
        (res: Response) => this.onFinally(null),
        (err: Response) => this.onFinally(err)
      );
  }
};

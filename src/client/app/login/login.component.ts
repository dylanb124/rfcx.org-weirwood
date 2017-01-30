import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../shared/user/user.service';

class LoginData {
  email: string;
  password: string;
}

@Component({
  // tslint:disable-next-line:component-selector-name
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
  message: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onKey(event: any) {
    // reset error message when user started to edit data
    this.message = null;
  }

  onFinally(err: any) {
    this.isLoading = false;
    this.message = null;
    if (err) {
      let error = err.json();
      this.message = error.message || 'Error in process of login.';
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.userService.logIn(this.login.email, this.login.password)
      .subscribe(
      res => this.onFinally(null),
      err => this.onFinally(err)
      );
  }
};

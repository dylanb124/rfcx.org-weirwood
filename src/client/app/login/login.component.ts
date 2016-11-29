import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../shared/user/user.service';

class LoginData {
    email: string;
    password: string;
}

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
})
export class LoginComponent {

    isLoading:boolean = false;
    login: LoginData = {
        email: '',
        password: ''
    };

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    onFinally() {
        this.isLoading = false;
    }

    onSubmit() {
        this.isLoading = true;
        this.userService.logIn(this.login.email, this.login.password)
        .subscribe(
            res => this.onFinally(),
            err => this.onFinally()
        );
    }
};

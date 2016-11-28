import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormControl } from '@angular/forms';

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
    login: LoginData = {
        email: '',
        password: ''
    };

    constructor(
        private userService: UserService, 
        private router: Router
    ) {}

    onSubmit() {
        this.userService.logIn(this.login.email, this.login.password)
    }
}
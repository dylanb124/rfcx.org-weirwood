import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  public userData: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = this.userService.getUserData();
  }

  logOut() {
    this.userService.logOut();
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

}

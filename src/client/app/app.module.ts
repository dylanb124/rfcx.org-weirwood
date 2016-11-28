import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';

import { LoginModule } from './login/login.module';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

import { UserService } from './shared/user/user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { LoggedInGuard } from './shared/user/logged-in.guard';

@NgModule({
  imports: [
    BrowserModule, 
    HttpModule, 
    RouterModule.forRoot(routes),
    LoginModule, 
    AboutModule, 
    HomeModule,
    SharedModule.forRoot(),
    FormsModule
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
    CookieService,
    UserService,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]

})

export class AppModule { }

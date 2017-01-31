import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';

import { StyleguideModule } from './styleguide/styleguide.module';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { IncidentsModule } from './incidents/incidents.module';
import { SharedModule } from './shared/shared.module';

import { UserService } from './shared/user/user.service';

import { LoggedInGuard } from './shared/user/logged-in.guard';
import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    StyleguideModule,
    LoginModule,
    HomeModule,
    IncidentsModule,
    SharedModule.forRoot(),
    FormsModule
  ],
  declarations: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_CONFIG, useValue: AppConfig },
    UserService,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]

})

export class AppModule { }

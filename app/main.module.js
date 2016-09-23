import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthProviders, FirebaseAuth } from 'angularfire2';
import { FirebaseModule } from './firebase';
import { AngularFire } from 'angularfire2';

import {
  TestComponent,
  TestListComponent,
  TestDetailComponent,
  HeaderComponent,
  SignInComponent
} from './components';

import {
  AuthGuard
} from './guards';

import { TestsStore } from './services/tests.service';
import { AuthService } from './services/auth.service';
import { FilterPipe } from './pipes';
import { routes } from './components/test.routes';

@NgModule({
  bootstrap: [TestComponent],
  declarations: [
    TestComponent,
    TestListComponent,
    TestDetailComponent,
    HeaderComponent,
    FilterPipe,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FirebaseModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    TestsStore,
    AuthGuard,
    AuthService,
    FirebaseAuth,
    AngularFire
  ]
})
export class MainModule {}

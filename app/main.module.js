import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MdCardModule } from '@angular2-material/card';
import { MdToolbarModule } from '@angular2-material/toolbar';
//import { AuthProviders, FirebaseAuth } from 'angularfire2';
//import { FirebaseModule } from './firebase';

import {
  TestComponent,
  TestListComponent,
  TestDetailComponent,
  HeaderComponent,
  SignInHeaderComponent
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
    SignInHeaderComponent
  ],
  imports: [
    MdCardModule.forRoot(),
    MdToolbarModule.forRoot(),
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
    FirebaseAuth
  ]
})
export class MainModule {}

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthProviders, FirebaseAuth } from 'angularfire2';
import { FirebaseModule } from './firebase';
import { AngularFire } from 'angularfire2';
import { enableProdMode } from '@angular/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ChartModule, Highcharts } from 'angular2-highcharts';
import * as Highcharts3d       from 'highcharts/highcharts-3d';
import { ModalModule } from 'ng2-bs4-modal/ng2-bs4-modal';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Chart } from 'chart.js';

import {
  TestComponent,
  TestListComponent,
  TestDetailComponent,
  HeaderComponent,
  SignInComponent,
  ResultsComponent,
  SummaryComponent,
  SuitesComponent
} from './components';

import {
  AuthGuard
} from './guards';
import { TestsStore } from './services/tests.service';
import { AuthService } from './services/auth.service';
import { SuitesService } from './services/suites.service';
import { FilterPipe } from './pipes';
import { OrderByPipe } from './pipes';
import { routes } from './components/test.routes';

@NgModule({
  bootstrap: [TestComponent],
  declarations: [
    TestComponent,
    TestListComponent,
    SuitesComponent,
    TestDetailComponent,
    HeaderComponent,
    FilterPipe,
    OrderByPipe,
    SignInComponent,
    ResultsComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    FirebaseModule,
    ChartModule,
    HttpModule,
    ModalModule,
    InfiniteScrollModule,
    DropdownModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    TestsStore,
    AuthGuard,
    AuthService,
    SuitesService,
    FirebaseAuth,
    AngularFire
  ]
})
export class MainModule {}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestsStore } from '../../services/tests.service';
import { MdCardModule } from '@angular2-material/card';
import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';
import { FirebaseListObservable } from 'angularfire2';

import template from './test-list.template.html';

@Component({
  selector: 'test-list',
  template: template,
  providers: [
    TestsStore
  ],
  directives: [
    TestDetailComponent
  ]
})

export class TestListComponent {

  constructor(route: ActivatedRoute, testsStore: TestsStore) {
    this._route = route;
    this._currentStatus = '';
    this.testsStore = testsStore;
  }

  ngOnInit() {
    var app = angular.module('app', ['ngMaterial'])
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
  }
}

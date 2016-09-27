import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';
import { TestsStore } from '../../services/tests.service'

import template from './test-list.template.html';

@Component({
  selector: 'test-list',
  template: template,
  directives: [
    TestDetailComponent
  ]
})

export class TestListComponent {
  suiteSubject = new Subject();
  testSubject = new Subject();
  filteredTests: Array = [];

  constructor(route: ActivatedRoute, testsStore: TestsStore) {
    this.testsStore = testsStore;
    this._route = route;
    this._currentStatus = '';

    this.suiteFilter = '';
    this.testFilter = '';
    this.resultFilter = 'FAIL';
    this.statusFilter = 'Consistent';

    this.suiteSubject
      .debounceTime(400)
      .subscribe(suite => this.suiteFilter = suite);
    this.testSubject
      .debounceTime(400)
      .subscribe(test => this.testFilter = test);
  }

  ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
  }

  onScroll() {
    console.log('scroll');
  }
}

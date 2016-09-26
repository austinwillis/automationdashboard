import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import { TestsStore } from '../../services/tests.service';
import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';

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

  constructor(route: ActivatedRoute, testsStore: TestsStore) {
    this._route = route;
    this._currentStatus = '';
    this.testsStore = testsStore;

    this.suiteFilter = '';
    this.testFilter = '';
    this.resultFilter = '';
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
}

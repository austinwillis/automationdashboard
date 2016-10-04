import { Component } from '@angular/core';
import { TestsStore } from '../../services/tests.service';
import { Subject } from 'rxjs/Rx';

import template from './results.template.html';

@Component({
  selector: 'test-results',
  template: template,
  inputs: ['testname']
})
export class ResultsComponent {

  commentSubject = new Subject();
  isLoading = true;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  ngOnInit() {
    this.testsStore.getResults(this.testname).subscribe(results => {
      this.results = results;
      this.isLoading = false;
    });
    this.commentSubject.subscribe(args => {
        this.updateComment(args[0], args[1], args[2]);
    })
  }

  updateComment(testname, key, comment) {
    console.log(comment);
    this.testsStore.updateCommentByResultKey(testname, key, comment);
  }

  toUTCDate(date) {
    var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
}

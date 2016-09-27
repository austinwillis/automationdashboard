import { Component } from '@angular/core';

import { TestsStore } from '../../services/tests.service';

import template from './summary.template.html';

@Component({
  selector: 'summary',
  template: template
})
export class SummaryComponent {

  isLoading = true;
  pass = 0;
  flake = 0;
  fail = 0;
  skip = 0;
  bug = 0;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  ngOnInit() {
    this.createStats();
  }

  findMostRecentRun(test) {
    return Math.max(Object.keys(test).filter(function(run) {
      return !isNaN(run);
    }));
  }

  createStatsByStatus(status) {
    return this.testsStore.results.filter(function(test) {
      let mostRecent = this.findMostRecentRun(test);
      return test[mostRecent] === status;
    }.bind(this)).length;
  }

  createStats() {
    this.totalTests = this.testsStore.results.length;
    this.pass = this.createStatsByStatus('Pass');
    this.fail = this.createStatsByStatus('Fail');
    this.flake = this.createStatsByStatus('Flake');
    this.skip = this.createStatsByStatus('Skip');
    this.bug = this.createStatsByStatus('Bug');
  }
}

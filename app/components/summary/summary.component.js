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
    if (!this.testsStore.loadedResults) {
      this.testsStore.loadingResults.subscribe(results => {
        this.createStats();
      });
    } else {
      this.createStats();
    }
  }

  findMostRecentRun(test) {
    return Object.keys(test).reduce(function(max, current) {
      return Math.max(max, isNaN(test[current].date) ? 0 : test[current].date );
    }, 0);
  }

  createStatsByStatus(status) {
    return this.testsStore.results.filter(test => {
      var mostRecent = this.findMostRecentRun(test);
      return !!Object.keys(test).filter(key => {
        return test[key].date === mostRecent && test[key].result === status;
      }).length;
    }).length;
  }

  createStats() {
    this.totalTests = this.testsStore.results.length;
    this.pass = this.createStatsByStatus('PASS');
    this.fail = this.createStatsByStatus('FAIL');
    this.flake = this.createStatsByStatus('FLAKE');
    this.skip = this.createStatsByStatus('SKIP');
    this.bug = this.createStatsByStatus('BUG');
  }
}

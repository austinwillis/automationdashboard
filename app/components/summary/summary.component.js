import { Component } from '@angular/core';
import { ChartModule, Highcharts } from 'angular2-highcharts';

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
      this.testsStore.loadingResults.subscribe(result => {
        if (result === 'true') {
          this.createStats();
        }
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
    this.pass = this.createStatsByStatus('PASSED');
    this.fail = this.createStatsByStatus('FAILED');
    this.flake = this.createStatsByStatus('FLAKE');
    this.skip = this.createStatsByStatus('SKIPPED');
    this.bug = this.createStatsByStatus('BUG');
  }
}

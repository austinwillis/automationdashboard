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
    
  }

  createStatsByStatus(status) {

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

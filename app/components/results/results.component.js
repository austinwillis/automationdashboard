import { Component } from '@angular/core';
import { TestsStore } from '../../services/tests.service';

import template from './results.template.html';

@Component({
  selector: 'test-results',
  template: template,
  inputs: ['testname']
})
export class ResultsComponent {

  isLoading = true;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  ngOnInit() {
    this.testsStore.getResults(this.testname).subscribe(results => {
      this.results = results;
      this.isLoading = false;
    });
  }
}

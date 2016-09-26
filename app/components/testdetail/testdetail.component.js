import { Component, Inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { ResultsComponent } from '../../components';
import { TestsStore } from '../../services/tests.service';

import template from './testdetail.template.html';

@Component({
  selector: 'test-detail',
  template: template,
  inputs: ['test'],
  directives: [NgClass, ResultsComponent]
})
export class TestDetailComponent {
  latestResult = '';
  showResults = false;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  toggleResults() {
    this.showResults = !this.showResults;
  }

  ngOnInit() {
    this.lastResultValue = this.test.lastResult[Object.keys(this.test.lastResult)[0]];
    this.classMap = this.findClassMapByResult(this.lastResultValue);
    this.testname = this.test.$key;
  }

  findClassMapByResult(result) {
    let classMap = {
      'card-success': false,
      'card-danger': false,
      'card-info': false,
      'card-warning': false
    };

    switch(result) {
      case 'Pass':
        return Object.assign(classMap, { 'card-success': true });
      case 'Fail':
      case 'Skip':
        return Object.assign(classMap, { 'card-danger': true });
      case 'Flake':
        return Object.assign(classMap, { 'card-info': true });
      case 'Bug':
        return Object.assign(classMap, { 'card-warning': true });
    }
  }

  updateResult(result) {
    this.testsStore.updateResult(this.test, Object.keys(this.test.lastResult)[0], result);
  }

  updateStatus(status) {
    this.testsStore.updateStatus(this.test, status);
  }
}

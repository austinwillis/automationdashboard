import { Component, Inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { TestsStore } from '../../services/tests.service';

import template from './testdetail.template.html';

@Component({
  selector: 'test-detail',
  template: template,
  inputs: ['test'],
  directives: [NgClass]
})
export class TestDetailComponent {
  latestResult = '';

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  ngOnInit() {
    this.lastResultValue = this.test.lastResult[Object.keys(this.test.lastResult)[0]];
    this.classMap = this.findClassMapByResult(this.lastResultValue);
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
}

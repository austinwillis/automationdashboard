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
  isSelected = false;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  selectElement(event) {
    if (event.ctrlKey) {
      console.log(this.isSelected);
      this.isSelected = !this.isSelected;
    }
  }

  toggleResults() {
    this.showResults = !this.showResults;
  }

  ngOnInit() {
    this.classMap = this.findClassMapByResult(this.test.lastResult.result);
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
      case 'PASS':
        return Object.assign(classMap, { 'bs-callout bs-callout-success': true });
      case 'FAIL':
        return Object.assign(classMap, { 'bs-callout bs-callout-danger': true });
      case 'SKIP':
        return Object.assign(classMap, { 'bs-callout bs-callout-warning': true });
      case 'FLAKE':
        return Object.assign(classMap, { 'bs-callout bs-callout-info': true });
      case 'BUG':
        return Object.assign(classMap, { 'bs-callout bs-callout-default': true });
    }
  }

  updateResult(result) {
    this.testsStore.updateResult(this.test, this.test.lastResult.date, result);
  }

  updateStatus(status) {
    this.testsStore.updateStatus(this.test, status);
  }
}

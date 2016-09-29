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
  showInfo = false;
  isSelected = false;

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  selectElement(event) {
    if (event.ctrlKey) {
      if (!this.test.selected) {
        this.testsStore.selectSubject.next(this.test.$key);
      } else {
        this.testsStore.unselectSubject.next(this.test.$key);
      }
    }
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
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
        return Object.assign(classMap, { 'bs-callout bs-callout-skip': true });
      case 'FLAKE':
        return Object.assign(classMap, { 'bs-callout bs-callout-info': true });
      case 'BUG':
        return Object.assign(classMap, { 'bs-callout bs-callout-warning': true });
    }
  }

  updateResult(result) {
    this.testsStore.updateResult(this.testname, result);
  }

  updateTeamMember(member) {
    this.testsStore.updateTeamMember(this.testname, member);
  }

  updateStatus(status) {
    this.testsStore.updateStatus(this.testname, status);
  }
}

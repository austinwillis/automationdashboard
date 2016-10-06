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
    if (!this.test.selected) {
      this.testsStore.selectSubject.next(this.test.$key);
    } else {
      this.testsStore.unselectSubject.next(this.test.$key);
    }
  }

  selectElementCtrlClick(event) {
    if (event.ctrlKey) {
      if (!this.test.selected) {
        this.testsStore.selectSubject.next(this.test.$key);
      } else {
        this.testsStore.unselectSubject.next(this.test.$key);
      }
    }
  }

  toggleInfo() {
    if (!this.test.open) {
      this.testsStore.openTestSubject.next(this.test.$key);
    } else {
      this.testsStore.closeTestSubject.next(this.test.$key);
    }
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
      case 'PASSED':
        return Object.assign(classMap, { 'bs-callout bs-callout-success': true });
      case 'FAILED':
        return Object.assign(classMap, { 'bs-callout bs-callout-danger': true });
      case 'SKIPPED':
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

import { Component, Inject } from '@angular/core';
import { NgClass } from '@angular/common';

import template from './testdetail.template.html';

@Component({
  selector: 'test-detail',
  template: template,
  inputs: ['test'],
  directives: [NgClass]
})
export class TestDetailComponent {
  constructor() {}

  ngOnInit() {
    this.classMap = this.findClassMapByResult(this.test['last-result']);
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
}

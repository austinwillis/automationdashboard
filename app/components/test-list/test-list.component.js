import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestsService } from '../../services/tests.service';
import { MdCardModule } from '@angular2-material/card';
import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';

import template from './test-list.template.html';

@Component({
  selector: 'test-list',
  template: template,
  providers: [
    TestsService
  ],
  directives: [
    TestDetailComponent
  ]
})

export class TestListComponent {

  constructor(route: ActivatedRoute, testService: TestsService) {
    this._route = route;
    this._currentStatus = '';
    this.testService = testService;
  }

  ngOnInit() {
    var app = angular.module('app', ['ngMaterial'])
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
    this.testService.getTests().then(data => {
      this.tests = data.json();
    });
  }
}

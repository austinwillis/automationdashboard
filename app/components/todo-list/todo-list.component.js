import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestsService } from '../../services/tests.service';

import template from './todo-list.template.html';

@Component({
  selector: 'todo-list',
  template: template,
  providers: [
    TestsService
  ]
})
export class TodoListComponent {

  constructor(route: ActivatedRoute, testService: TestsService) {
    this._route = route;
    this._currentStatus = '';
    this.testService = testService;
  }

  ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
    this.testService.getTests().then(data => {
      this.tests = data.json();
    }).catch(handleError);
  }
}

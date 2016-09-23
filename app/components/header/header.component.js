import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import template from './header.template.html';

@Component({
  selector: 'test-header',
  template: template,
  inputs: ['test']
})
export class HeaderComponent {
  suiteSearch = new Subject();
  testSearch = new Subject();
  @Output() suite = new EventEmitter();
  @Output() testsearch = new EventEmitter();
  @Output() result = new EventEmitter();

  constructor(auth: AuthService) {
    this.auth = auth;
    this.suiteSearch
      .debounceTime(400)
      .subscribe(suiteSearch => this.searchSuite(suiteSearch));
    this.testSearch
      .debounceTime(400)
      .subscribe(testSearch => this.searchTest(testSearch));
  }

  ngOnInit() {
    this.suite.emit('');
    this.testsearch.emit('');
    this.result.emit('');
  }

  searchSuite(suite) {
    this.suite.emit(suite);
  }

  searchTest(test) {
    this.testsearch.emit(test);
  }

  searchResult(result) {
    this.result.emit(result);
  }

  signOut() {
    this.auth.signOut();
  }
}

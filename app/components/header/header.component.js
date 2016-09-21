import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MdToolbarModule } from '@angular2-material/toolbar';

import template from './header.template.html';

@Component({
  selector: 'test-header',
  template: template,
  inputs: ['test']
})
export class HeaderComponent {
  @Output() suite = new EventEmitter();
  @Output() testsearch = new EventEmitter();
  @Output() result = new EventEmitter();

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
}

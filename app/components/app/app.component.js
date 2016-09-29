import { Component, Inject } from '@angular/core';
import { TestsStore } from '../../services/tests.service';

import template from './app.template.html';

@Component({
  selector: 'test-app',
  template: template,
  bindings: [TestsStore]
})
export class TestComponent {
  constructor() {}
}

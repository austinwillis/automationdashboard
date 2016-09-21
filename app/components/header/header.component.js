import { Component, Inject } from '@angular/core';

import template from './testdetail.template.html';

@Component({
  selector: 'test-detail',
  template: template,
  inputs: ['test']
})
export class HeaderComponent {
  constructor() {}
}

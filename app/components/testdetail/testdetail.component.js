import { Component, Inject } from '@angular/core';
import { MdCardModule } from '@angular2-material/card';

import template from './testdetail.template.html';

@Component({
  selector: 'test-detail',
  template: template,
  inputs: ['test']
})
export class TestDetailComponent {
  constructor() {}
}

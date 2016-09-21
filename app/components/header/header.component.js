import { Component, Inject } from '@angular/core';
import { MdToolbarModule } from '@angular2-material/toolbar';

import template from './header.template.html';

@Component({
  selector: 'test-header',
  template: template,
  inputs: ['test']
})
export class HeaderComponent {
  constructor() {}
}

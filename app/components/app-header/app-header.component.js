import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import template from './app-header.template.html';

@Component({
  selector: 'app-header',
  template: template
})
export class SignInHeaderComponent {
  constructor() {
    console.log("Header");
  }

  @Input() authenticated;
  @Output() signOut = new EventEmitter(false);
}

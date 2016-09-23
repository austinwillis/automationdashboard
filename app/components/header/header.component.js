import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import template from './header.template.html';

@Component({
  selector: 'test-header',
  template: template,
  inputs: ['test']
})
export class HeaderComponent {
  constructor(auth: AuthService) {
    this.auth = auth;
  }

  signOut() {
    this.auth.signOut();
  }
}

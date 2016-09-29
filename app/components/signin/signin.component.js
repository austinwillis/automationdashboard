import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import template from './signin.template.html';

@Component({
  selector: 'signin',
  template: template
})
export class SignInComponent {

  constructor(router: Router, auth: AuthService) {
    this.auth = auth;
    this.router = router;
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle()
      .then(() => this.postSignIn());
  }

  postSignIn() {
    this.router.navigate(['/tests']);
  }

}

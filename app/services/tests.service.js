import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { AuthService } from './auth.service';

@Injectable()
export class TestsStore {

  tests: FirebaseListObservable;

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    this.tests = af.database.list(`/`);
  }
}

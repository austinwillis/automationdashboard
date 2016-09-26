import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

@Injectable()
export class TestsStore {

  isLoading = true;
  tests: FirebaseListObservable;

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    af.database.list('/tests').subscribe(tests => {
      this.tests = tests;
      this.isLoading = false;
    });
  }

  updateResult(test, date, result) {
    this.af.database.object(`/tests/${test['$key']}/lastResult/${date}`).set(result)
    this.af.database.object(`/results/${test['$key']}/${date}`).set(result);
  }
}

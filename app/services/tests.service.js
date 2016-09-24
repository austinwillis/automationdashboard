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
    this.tests = af.database.list(`/`)
    this.tests.subscribe(() => {
      this.isLoading = false;
    });
  }

  updateResult(test, result) {
    test['last-result'] = result;
    this.tests.update(test.$key, { 'testname': test.testname, 'suite': test.suite, 'last-result' : result });
  }
}

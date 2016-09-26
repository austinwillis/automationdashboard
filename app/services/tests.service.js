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

  updateResult(test, result) {
    this.af.database.list('/tests').update(test, { 'lastResult': result });
    this.af.database.list(`/results/${test['$key']}`).then(results => {
      console.log(results);
      let key = results['0']['$key'];
      this.af.database.object(`/results/${test['$key']}/${key}`).set(result);
    });
  }
}

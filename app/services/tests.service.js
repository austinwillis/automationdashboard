import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';

@Injectable()
export class TestsStore {

  isLoading = true;
  instance: TestsStore;

  constructor(af: AngularFire, auth: AuthService) {
    console.log('construct service');
    this.af = af;
    this.auth = auth;
    af.database.list('/tests').subscribe(tests => {
      this.tests = tests;
      this.isLoading = false;
      this.visisbleTests = this.tests.slice(0, this.numberVisible);
    });
    af.database.list('/results').subscribe(results => {
      this.results = results
    })
  }

  updateResult(test, date, result) {
    this.af.database.object(`/tests/${test['$key']}/lastResult/${date}`).set(result)
    this.af.database.object(`/results/${test['$key']}/${date}`).set(result);
  }

  updateStatus(test, status) {
    console.log(test);
    console.log(status);
    this.af.database.object(`/tests/${test['$key']}/status`).set(status);
  }

  getResults(testname) {
    return this.af.database.list(`/results/${testname}`);
  }
}

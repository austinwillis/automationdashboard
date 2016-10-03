import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class SuitesService {

  constructor(af: AngularFire) {
    this.af = af;
  }

  getSuites() {
    return this.af.database.list('/suites');
  }

  addNewSuite(index) {
    var suiteObject = {suite: '', url: ''};
    this.af.database.object(`suites/${index}`).set(suiteObject);
  }

  removeSuite(index) {
    this.af.database.object(`suites/${index}`).remove();
  }

  updateSuiteName(index, name) {
    this.af.database.object(`suites/${index}/suite`).set(name);
  }

  updateSuiteURL(index, url) {
    this.af.database.object(`suites/${index}/url`).set(url);
  }
}

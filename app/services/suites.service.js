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
}

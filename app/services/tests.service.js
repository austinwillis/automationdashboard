import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TestsStore {

  tests: FirebaseListObservable;

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    this.isLoading = true;
    af.database.list(`/`).subscribe(data => {
      this.tests = data;
      this.isLoading = false;
    });
  }
}

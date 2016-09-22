import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState } from 'angularfire2';

const FIREBASE_URL = 'https://automato-9b898.firebaseio.com/.json';

@Injectable()
export class AuthService {
  authState: FirebaseAuthState = null;

  constructor(auth$: FirebaseAuth) {
    // this.auth$ = auth$;
    // auth$.subscribe((state: FirebaseAuthState) => {
    //   this.authState = state;
    // });
  }

}

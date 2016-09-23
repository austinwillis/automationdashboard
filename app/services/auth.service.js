import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { Router } from '@angular/router';

const FIREBASE_URL = 'https://automato-9b898.firebaseio.com/.json';

@Injectable()
export class AuthService {
  authState: FirebaseAuthState = null;

  constructor(auth$: FirebaseAuth, router: Router) {
    this.auth$ = auth$;
    this.router = router;
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated() {
    return this.authState !== null;
  }

  get id() {
    return this.authenticated ? this.authState.uid : '';
  }

  signIn(provider: number): firebase.Promise {
    return this.auth$.login({provider})
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Google);
  }

  signOut() {
    this.auth$.logout();
    this.router.navigate(['/login']);
  }
}

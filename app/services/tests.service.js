import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const FIREBASE_URL = 'https://automato-9b898.firebaseio.com/.json';

@Injectable()
export class TestsStore {

  constructor(http: Http) {
     http.get(FIREBASE_URL)
                   .toPromise().then(data => {
                     this.tests = data.json();
                   });;
  }
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const FIREBASE_URL = 'https://automato-9b898.firebaseio.com/.json';

export class TestsService {
  constructor(http: Http) {
    this.http = http;
  }

  getTests() {
    return this.http.get(FIREBASE_URL)
                  .toPromise();
                  // .then(this.extractData)
                  // .catch(this.handleError);
  }
}

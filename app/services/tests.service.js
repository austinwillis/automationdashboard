import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class TestsStore {

  isLoading = true;
  loadedResults = false;
  loadingResults = new Subject();
  selectedTests = [];

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    var self = this;
    af.database.list('/tests').subscribe(tests => {
      this.tests = tests;
      this.isLoading = false;
    });
    this.af.database.list('/results').subscribe(results => {
      this.results = results;
      this.loadedResults = true;
      this.loadingResults.next();
    });
  }

  getAllResults() {
    return this.results;
  }

  massChangeStatus(status) {
    var self = this;
    this.selectedTests.forEach(function(test) {
      self.updateStatus(test, status);
    });
    this.selectedTests = [];
  }

  massChangeResult(result) {
    var self = this;
    this.selectedTests.forEach(function(test) {
      self.updateResult(test, result);
    });
    this.selectedTests = [];
  }

  addToSelected(test) {
    this.selectedTests.push(test);
  }

  removeFromSelected(test) {
    var index = this.selectedTests.indexOf(test);
    if (index > -1) {
      this.selectedTests.splice(index,1);
    }
  }

  updateResult(test, result) {
    console.log('update');
    this.af.database.object(`/tests/${test['$key']}/lastResult/result`).set(result)
    var resultKey = getKeyOfNewestResult(test);
    console.log(resultKey);
    //this.af.database.object(`results/${test['$key']}/${resultKey}/result`).set(result);
  }

  getKeyOfNewestResult(test) {
    var key = test.$key;
    var resultsForTest = this.results.filter(results => {
      return results.$key === key;
    })[0];
    var resultKey = '';
    for (var k in resultsForTest) {
      if (k !== '$key' && k !== '$exists' && resultsForTest[k].date === test.lastResult.date) {
        resultKey = k;
      }
    }
    return resultKey;
  }

  updateStatus(test, status) {
    this.af.database.object(`/tests/${test['$key']}/status`).set(status);
  }

  getResults(testname) {
    return this.af.database.list(`/results/${testname}`, {
      query: {
        orderByValue: 'date'
      }
    });
  }
}

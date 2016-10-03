import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FilterPipe } from '../pipes/filter/filter.pipe';

@Injectable()
export class TestsStore {

  isLoading = true;
  loadedResults = false;
  loadingResults = new BehaviorSubject();
  selectedTests = [];
  tests = [];

  filteredTestsSubject = new BehaviorSubject();

  selectAll = false;
  selectAllSubject = new BehaviorSubject();
  suiteSubject = new BehaviorSubject();
  testSubject = new BehaviorSubject();
  resultSubject = new BehaviorSubject();
  statusSubject = new BehaviorSubject();

  unselectSubject = new BehaviorSubject();
  selectSubject = new BehaviorSubject();

  suiteFilter = '';
  testFilter = '';
  resultFilter = '';
  statusFilter = '';

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    this.filter = new FilterPipe().transform;
    this.suiteSubject.next('');
    this.testSubject.next('');
    this.resultSubject.next('');
    this.statusSubject.next('');
    var self = this;
    af.database.list('/tests').subscribe(tests => {
      this.tests = tests;
      this.filterAndSelectTests();
      this.isLoading = false;
    });
    this.subscribeToFilters();
    this.subscribeToSelect();
    af.database.list('/team').subscribe(team => {
      this.team = team;
    })
    af.database.list('/results').subscribe(results => {
      this.results = results;
      this.loadedResults = true;
      this.loadingResults.next('true');
    });
  }

  filterAndSelectTests() {
    this.filteredTestsSubject.next(this.filter(this.tests, this.suiteFilter, this.testFilter, this.resultFilter, this.statusFilter).map(test => {
      if (this.selectedTests.indexOf(test.$key) > -1) {
        test.selected = true;
      } else {
        test.selected = false;
      }
      return test;
    }));
  }

  getFilteredTests() {
    return this.filter(this.tests, this.suiteFilter, this.testFilter, this.resultFilter, this.statusFilter);
  }

  subscribeToFilters() {
    this.suiteSubject.debounceTime(300).subscribe(value => {
      this.suiteFilter = value;
      this.selectedTests = [];
      this.selectAll = false;
      this.filterAndSelectTests();
    });
    this.testSubject.debounceTime(300).subscribe(value => {
      this.testFilter = value;
      this.selectAll = false;
      this.selectedTests = [];
      this.filterAndSelectTests();
    });
    this.resultSubject.subscribe(value => {
      this.resultFilter = value;
      this.selectAll = false;
      this.selectedTests = [];
      this.filterAndSelectTests();
    });
    this.statusSubject.subscribe(value => {
      this.statusFilter = value;
      this.selectAll = false;
      this.selectedTests = [];
      this.filterAndSelectTests();
    });
  }

  subscribeToSelect() {
    this.selectSubject.subscribe(test => {
      this.selectedTests.push(test);
      this.filterAndSelectTests();
    });
    this.unselectSubject.subscribe(test => {
      var index = this.selectedTests.indexOf(test);
      if (index > -1) {
        this.selectedTests.splice(index,1);
      }
      this.filterAndSelectTests();
    });
    this.selectAllSubject.subscribe(value => {
      if (this.selectAll) {
        this.selectedTests = [];
        this.selectAll = false;
        this.filterAndSelectTests();
      } else {
        this.selectedTests = this.getFilteredTests().map(test => {
          test.selected = true;
          return test.$key;
        });
        this.selectAll = true;
        this.filterAndSelectTests();
      }
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
    this.selectAll = false;
    this.filterAndSelectTests();
  }

  massChangeResult(result) {
    var self = this;
    this.selectedTests.forEach(function(test) {
      self.updateResult(test, result);
    });
    this.selectedTests = [];
    this.selectAll = false;
    this.filterAndSelectTests();
  }

  updateResult(testname, result) {
    this.af.database.object(`/tests/${testname}/lastResult/result`).set(result)
    var resultKey = this.getKeyOfNewestResult(testname);
    this.af.database.object(`results/${testname}/${resultKey}/result`).set(result);
  }

  updateTeamMember(testname, member) {
    this.af.database.object(`/tests/${testname}/teamMember`).set(member)
    var resultKey = this.getKeyOfNewestResult(testname);
    this.af.database.object(`results/${testname}/${resultKey}/teamMember`).set(member);
  }

  getKeyOfNewestResult(testname) {
    var resultsForTest = this.results.filter(results => {
      return results.$key === testname;
    })[0];
    var maxDate = 0;
    var resultKey = '';
    for (var k in resultsForTest) {
      if (k !== '$key' && k !== '$exists' && resultsForTest[k].date > maxDate) {
        maxDate = resultsForTest[k].date
        resultKey = k;
      }
    }
    return resultKey;
  }

  updateStatus(testname, status) {
    this.af.database.object(`/tests/${testname}/status`).set(status);
  }

  updateCommentByResultKey(testname, key, comment) {
    this.af.database.object(`results/${testname}/${key}/comment`).set(comment);
  }

  getResults(testname) {
    return this.af.database.list(`/results/${testname}`, {
      query: {
        orderByValue: 'date'
      }
    });
  }
}

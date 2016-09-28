import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { FilterPipe } from '../pipes/filter/filter.pipe';

@Injectable()
export class TestsStore {

  isLoading = true;
  loadedResults = false;
  loadingResults = new Subject();
  selectedTests = [];
  tests = [];

  selectAll = false;
  selectAllSubject = new Subject();
  suiteSubject = new Subject();
  testSubject = new Subject();
  resultSubject = new Subject();
  statusSubject = new Subject();

  unselectSubject = new Subject();
  selectSubject = new Subject();

  suiteFilter = '';
  testFilter = '';
  resultFilter = '';
  statusFilter = '';

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    this.auth = auth;
    this.filter = new FilterPipe().transform;
    var self = this;
    af.database.list('/tests').subscribe(tests => {
      this.tests = tests;
      this.filteredTests = this.filterAndSelectTests();
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
      this.loadingResults.next();
    });
  }

  filterAndSelectTests() {
    return this.filter(this.tests, this.suiteFilter, this.testFilter, this.resultFilter, this.statusFilter).map(test => {
      if (this.selectedTests.indexOf(test.$key) > -1) {
        test.selected = true;
      } else {
        test.selected = false;
      }
      return test;
    });
  }

  subscribeToFilters() {
    this.suiteSubject.subscribe(value => {
      this.suiteFilter = value;
      this.filteredTests = this.filterAndSelectTests();
    });
    this.testSubject.subscribe(value => {
      this.testFilter = value;
      this.filteredTests = this.filterAndSelectTests();
    });
    this.resultSubject.subscribe(value => {
      this.resultFilter = value;
      this.filteredTests = this.filterAndSelectTests();
    });
    this.statusSubject.subscribe(value => {
      this.statusFilter = value;
      this.filteredTests = this.filterAndSelectTests();
    });
  }

  subscribeToSelect() {
    this.selectSubject.subscribe(test => {
      this.selectedTests.push(test);
      this.filteredTests = this.filterAndSelectTests();
    });
    this.unselectSubject.subscribe(test => {
      var index = this.selectedTests.indexOf(test);
      if (index > -1) {
        this.selectedTests.splice(index,1);
      }
      this.filteredTests = this.filterAndSelectTests();
    });
    this.selectAllSubject.subscribe(value => {
      if (this.selectAll) {
        this.selectedTests = [];
        this.selectAll = false;
        this.filteredTests = this.filterAndSelectTests();
      } else {
        this.selectedTests = this.filteredTests.map(test => {
          return test.$key;
        });
        this.selectAll = true;
        this.filteredTests = this.filterAndSelectTests();
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
    this.filteredTests = this.filterAndSelectTests();
  }

  massChangeResult(result) {
    var self = this;
    this.selectedTests.forEach(function(test) {
      self.updateResult(test, result);
    });
    this.selectedTests = [];
    this.filteredTests = this.filterAndSelectTests();
  }

  updateResult(test, result) {
    this.af.database.object(`/tests/${test['$key']}/lastResult/result`).set(result)
    var resultKey = this.getKeyOfNewestResult(test);
    this.af.database.object(`results/${test['$key']}/${resultKey}/result`).set(result);
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

  updateTeamMember(test, member) {
    var resultKey = this.getKeyOfNewestResult(test);
    this.af.database.object(`results/${test['$key']}/${resultKey}/teamMember`).set(result);
  }

  updateTeamMemberByResultKey(testname, key, member) {
    this.af.database.object(`results/${testname}/${key}/teamMember`).set(member);
  }

  getResults(testname) {
    return this.af.database.list(`/results/${testname}`, {
      query: {
        orderByValue: 'date'
      }
    });
  }
}

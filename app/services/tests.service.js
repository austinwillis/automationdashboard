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
  assignedToMe = false;
  loadingResults = new BehaviorSubject();
  selectedTests = [];
  openTests = [];
  tests = [];

  openTestSubject = new Subject();
  closeTestSubject = new Subject();

  filteredTestsSubject = new BehaviorSubject();

  selectAll = false;
  selectAllSubject = new BehaviorSubject();
  suiteSubject = new BehaviorSubject();
  testSubject = new BehaviorSubject();
  resultSubject = new BehaviorSubject();
  statusSubject = new BehaviorSubject();
  personSubject = new Subject();

  unselectSubject = new BehaviorSubject();
  selectSubject = new BehaviorSubject();

  suiteFilter = '';
  personFilter = '';
  testFilter = '';
  resultFilter = '';
  statusFilter = '';

  constructor(af: AngularFire, auth: AuthService) {
    this.af = af;
    auth.auth$.subscribe(auth => {
      this.auth = auth;
    })
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
    this.subscribeToOpen();
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
    this.filteredTestsSubject.next(this.filter(this.tests, this.suiteFilter, this.testFilter, this.resultFilter, this.statusFilter, this.personFilter).map(test => {
      if (this.selectedTests.indexOf(test.$key) > -1) {
        test.selected = true;
      } else {
        test.selected = false;
      }
      if (this.openTests.indexOf(test.$key) > -1) {
        test.open = true;
      } else {
        test.open = false;
      }
      return test;
    }));
  }

  getFilteredTests() {
    return this.filter(this.tests, this.suiteFilter, this.testFilter, this.resultFilter, this.statusFilter, this.personFilter);
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
    this.personSubject.subscribe(value => {
      this.toggleAssignedToMe();
      this.filterAndSelectTests();
    })
  }

  toggleAssignedToMe() {
    if (this.assignedToMe) {
      this.personFilter = '';
      this.assignedToMe = false;
    } else {
      this.personFilter = this.auth.google.displayName;
      this.assignedToMe = true;
    }
  }

  assignSelectedToMe() {
    var self = this;
    this.selectedTests.forEach(function(test) {
      self.assignToMe(test);
    });
    this.selectedTests = [];
    this.selectAll = false;
    this.filterAndSelectTests();
  }

  clearFilters() {
    this.suiteFilter = '';
    this.personFilter = '';
    this.testFilter = '';
    this.resultFilter = '';
    this.statusFilter = '';
    this.filterAndSelectTests();
  }

  assignToMe(test) {
    this.af.database.object(`/tests/${test}/teamMember`).set(this.auth.google.displayName);
    var resultKey = this.getKeyOfNewestResult(test);
    this.af.database.object(`results/${test}/${resultKey}/teamMember`).set(this.auth.google.displayName);
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
          return test.$key;
        });
        this.selectAll = true;
        this.filterAndSelectTests();
      }
    });
  }

  subscribeToOpen() {
    this.openTestSubject.subscribe(test => {
      this.openTests.push(test);
      this.filterAndSelectTests();
    });
    this.closeTestSubject.subscribe(test => {
      var index = this.openTests.indexOf(test);
      if (index > -1) {
        this.openTests.splice(index,1);
      }
      this.filterAndSelectTests();
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

  createTestRunXML() {
    var classes = "";
    this.selectedTests.forEach(testName => {
      var index = this.tests.map(t => { return t.$key }).indexOf(testName);
      var className = this.tests[index].package + '.' + testName.split('_')[0];
      var methodName = testName.match(/_\w+/)[0].replace('_','');
      classes += `<class name="${className}">\n<methods>\n<include name="${methodName}" />\n<include name="createTestData" />\n</methods>\n</class>\n`;
    });
    return `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd"><suite name="Custom" verbose="2" configfailurepolicy="continue">\n<test name="DashboardGenerateTest">\n<classes>\n${classes}</classes>\n</test>\n</suite>`
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

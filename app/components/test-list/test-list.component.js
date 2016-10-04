import { Component, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { DROPDOWN_DIRECTIVES } from 'ng2-dropdown';

import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';
import { TestsStore } from '../../services/tests.service'
import { OrderByPipe } from '../../pipes/orderBy/orderBy.pipe';

import template from './test-list.template.html';

@Component({
  selector: 'test-list',
  template: template,
  directives: [
    DROPDOWN_DIRECTIVES,
    TestDetailComponent
  ]
})

export class TestListComponent {
  filteredTests: Array = [];
  @ViewChild('StatusModal')
  statusModal: ModalComponent;
  @ViewChild('ResultModal')
  resultModal: ModalComponent;
  @ViewChild('AssignModal')
  assignModal: ModalComponent;
  visibleTests = [];
  oldFilteredTests = [];
  filteredTests = [];

  constructor(route: ActivatedRoute, testsStore: TestsStore) {
    this.testsStore = testsStore;
    this._route = route;
    this._currentStatus = '';
  }

  ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
    this.testsStore.filteredTestsSubject.subscribe(tests => {
      this.oldFilteredTests = this.filteredTests;
      this.filteredTests = tests;
      this.sortFilteredTests();
      if (this.filteredTests != undefined) {
        this.initializeVisibleTests();
      }
    });
  }

  sortFilteredTests() {
    this.filteredTests.sort(this.dynamicSort('suite'));
  }

  initializeVisibleTests() {
    if (this.filteredTests.map(test => { return test.$key }).sort().join(',') === this.oldFilteredTests.map(test => { return test.$key }).sort().join(',')) {
      this.visibleTests = this.filteredTests.slice(0, this.visibleTests.length);
    } else {
      this.visibleTests = this.filteredTests.slice(0, 30);
    }
  }

  confirmMassResultChange() {
    this.testsStore.massChangeResult(this.newMassResult);
    this.resultModal.close();
  }

  confirmMassChangeStatus() {
    this.testsStore.massChangeStatus(this.newMassStatus);
    this.statusModal.close();
  }

  cancel() {
    this.statusModal.close();
    this.resultModal.close();
    this.assignModal.close();
  }

  openResultModal(result) {
    this.newMassResult = result;
    this.resultModal.open();
  }

  openStatusModal(status) {
    this.newMassStatus = status;
    this.statusModal.open();
  }

  assignSelectedToMe() {
    this.assignModal.open();
  }

  confirmAssignToMe() {
    this.testsStore.assignSelectedToMe();
    this.assignModal.close();
  }

  onScroll() {
    if (this.visibleTests.length < this.filteredTests.length - 20) {
      this.visibleTests.push(...this.filteredTests.slice(this.visibleTests.length, this.visibleTests.length + 20));
    } else {
      this.visibleTests = this.filteredTests;
    }
  }

  dynamicSort(property) {
     var sortOrder = 1;
     if(property[0] === "-") {
         sortOrder = -1;
         property = property.substr(1);
     }
     return function (a,b) {
         var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
         return result * sortOrder;
     }
   }
}

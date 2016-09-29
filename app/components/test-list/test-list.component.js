import { Component, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { DROPDOWN_DIRECTIVES } from 'ng2-dropdown';

import { TestDetailComponent } from '../../components';
import { HeaderComponent } from '../../components';
import { TestsStore } from '../../services/tests.service'

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
  visibleTests = [];

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
      this.filteredTests = tests;
      if (this.filteredTests != undefined) {
        this.initializeVisibleTests();
      }
    });
  }

  initializeVisibleTests() {
    this.visibleTests = this.filteredTests.slice(0, 30);
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
  }

  openResultModal(result) {
    this.newMassResult = result;
    this.resultModal.open();
  }

  openStatusModal(status) {
    this.newMassStatus = status;
    this.statusModal.open();
  }

  onScroll() {
    if (this.visibleTests.length < this.filteredTests.length - 15) {
      this.visibleTests.push(...this.filteredTests.splice(this.visibleTests.length, this.visibleTests.length + 20));
    } else {
      this.visibleTests.push(...this.filteredTests.splice(this.visibleTests.lenth, this.filteredTests.length));
    }
  }
}

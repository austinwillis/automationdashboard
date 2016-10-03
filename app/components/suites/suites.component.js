import { Component, ViewChild } from '@angular/core';
import { SuitesService } from '../../services/suites.service.js';
import template from './suites.template.html';

@Component({
  selector: 'suites',
  template: template
})
export class SuitesComponent {
  suiteToRemoveName;
  suiteToRemoveIndex;
  loading = true;
  @ViewChild('ConfirmDeleteModal')
  confirmDeleteModal: ModalComponent;

  constructor(suitesService: SuitesService) {
    this.suitesService = suitesService;
    this.suitesService.getSuites().subscribe(suites => {
      this.suites = suites;
      this.loading = false;
    })
  }

  addNewSuite(index) {
    this.suitesService.addNewSuite(this.suites.length);
  }

  removeSuite(index, name) {
    this.suiteToRemoveName = name;
    this.suiteToRemoveIndex = index;
    this.confirmDeleteModal.open();
  }

  cancel() {
    this.confirmDeleteModal.close();
  }

  confirmRemoveSuite() {
    this.suitesService.removeSuite(this.suiteToRemoveIndex);
    this.confirmDeleteModal.close();
  }

  updateSuiteName(index, name) {
    this.suitesService.updateSuiteName(index, name);
  }

  updateSuiteURL(index, url) {
    this.suitesService.updateSuiteURL(index, url);
  }
}

import { Component } from '@angular/core';
import { SuitesService } from '../../services/suites.service.js';

import template from './suites.template.html';

@Component({
  selector: 'suites',
  template: template,
})
export class SuitesComponent {
  constructor(suitesService: SuitesService) {
    this.suitesService = suitesService;
    this.suitesService.getSuites().subscribe(suites => {
      this.suites = suites;
    })
  }
}

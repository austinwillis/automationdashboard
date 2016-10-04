import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StatsService {

  loadedResults = false;
  loadingResults = new BehaviorSubject();
  resultsSubject = new BehaviorSubject();

  constructor(af: AngularFire) {
    af.database.list('/results').subscribe(results => {
      this.results = results;
      this.createStats();
    });
  }

  findMostRecentRun(test) {
    return Object.keys(test).reduce(function(max, current) {
      return Math.max(max, isNaN(test[current].date) ? 0 : test[current].date );
    }, 0);
  }

  createStatsByStatus(status) {
    return this.testsStore.results.filter(test => {
      var mostRecent = this.findMostRecentRun(test);
      return !!Object.keys(test).filter(key => {
        return test[key].date === mostRecent && test[key].result === status;
      }).length;
    }).length;
  }

  createStats() {
    this.totalTests = this.testsStore.results.length;
    this.pass = this.options.series[0].data[0].y = this.createStatsByStatus('PASSED');
    this.fail = this.options.series[0].data[1].y = this.createStatsByStatus('FAILED');
    this.flake = this.options.series[0].data[2].y = this.createStatsByStatus('FLAKE');
    this.skip = this.options.series[0].data[3].y = this.createStatsByStatus('SKIPPED');
    this.bug = this.options.series[0].data[4].y = this.createStatsByStatus('BUG');
    this.resultSubject.next([this.pass, this.fail, this.flake, this.skip, this.bug]);
  }

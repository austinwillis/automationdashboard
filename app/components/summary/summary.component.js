import { Component } from '@angular/core';
import { ChartModule, Highcharts } from 'angular2-highcharts';

import { TestsStore } from '../../services/tests.service';

import template from './summary.template.html';

@Component({
  selector: 'summary',
  template: template
})
export class SummaryComponent {

  options = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Current Test Statstics'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [
              {
                name: 'Pass',
                y: this.pass
              },
              {
                name: 'Fail',
                y: this.fail
              },
              {
                name: 'Flake',
                y: this.flake
              },
              {
                name: 'Skip',
                y: this.skip
              },
              {
                name: 'Bug',
                y: this.bug
              }
            ]
          }]
        };
    options: Object;

  isLoading = true;
  pass = 0;
  flake = 0;
  fail = 0;
  skip = 0;
  bug = 0;

  chart: HighchartsChartObject;

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  constructor(testsStore: TestsStore) {
    this.testsStore = testsStore;
  }

  ngOnInit() {
    if (!this.testsStore.loadedResults) {
      this.testsStore.loadingResults.subscribe(result => {
        if (result === 'true') {
          this.createStats();
        }
      });
    } else {
      this.createStats();
    }
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
    this.saveInstance(this.chart);
    console.log(this.pass);
  }
}

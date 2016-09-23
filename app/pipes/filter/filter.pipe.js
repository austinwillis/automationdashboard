import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value, suite, test, result) {
    if (value !== undefined && Array.isArray(value)) {
      return value.filter((item) => item['suite'].toLowerCase().includes(suite.toLowerCase())
       & item['testname'].toLowerCase().includes(test.toLowerCase())
        & item['last-result'].includes(result));
    } else {
      return value;
    }
  }
}

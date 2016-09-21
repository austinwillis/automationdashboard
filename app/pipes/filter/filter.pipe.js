import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value, suite, test, result) {
    if (value != undefined) {
      return value.filter((item) => item.suite.toLowerCase().indexOf(suite) !== -1
       & item.testname.toLowerCase().indexOf(test) !== -1
        & item['last-result'].indexOf(result) !== -1);
    } else {
      return value;
    }
  }
}

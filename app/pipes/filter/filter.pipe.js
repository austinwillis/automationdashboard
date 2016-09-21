import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value, suite, test) {
    console.log(suite);
    console.log(test);
    if (value != undefined) {
      return value.filter((item) => item.suite.indexOf(suite) !== -1 & item.testname.indexOf(test) !== -1);
    } else {
      return value;
    }
  }
}

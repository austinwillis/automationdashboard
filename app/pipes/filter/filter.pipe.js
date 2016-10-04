import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value, suite, test, result, status, teamMember) {
    if (value !== undefined && Array.isArray(value)) {
      return value.filter((item) => {
        return item.suite.toLowerCase().includes(suite.toLowerCase())
       && item.$key.toLowerCase().includes(test.toLowerCase())
       && item.status.includes(status)
       && item.lastResult.result.includes(result)
       && item.teamMember.includes(teamMember);
     });
    } else {
      return value;
    }
  }
}

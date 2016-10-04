import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
 name: 'orderBy'
})
export class OrderByPipe{

 transform(array, value){
   return array.sort(this.dynamicSort(value));
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

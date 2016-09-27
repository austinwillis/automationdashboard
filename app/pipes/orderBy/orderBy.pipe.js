import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
 name: 'orderBy'
})
export class OrderByPipe{

 transform(array){
   return array.sort(function(a,b) {return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);} );
 }
}

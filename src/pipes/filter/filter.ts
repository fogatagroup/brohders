import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], attr: string, value: string) {
    if(!items){
      return [];
    } 
    if(!attr || !value){
      return items;
    }
    console.log("FILTERING:", `${attr}:${value}`);
    return items.filter(i => i[attr].toLowerCase().indexOf(value.toLowerCase()) > -1);
  }
}

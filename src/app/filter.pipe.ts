import { Pipe, PipeTransform } from '@angular/core';




@Pipe({ name: 'filterBy' })
export class FilterByStatusPipe implements PipeTransform {

  transform(list: any, name: string): any {
    if (list && list.length > 0 && list[0].hasOwnProperty('name')) {
      return list.filter((listing: any) => listing.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }
    if (list && list.length > 0 && list[0].hasOwnProperty('taskName')) {
      return list.filter((listing: any) => listing.taskName.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }
  }
}
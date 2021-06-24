import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginateService {

  constructor() { }

   paginate(array: any[], size:number, number: number): any[] {
       return array.slice((number - 1) * size, number * size);
  }
}

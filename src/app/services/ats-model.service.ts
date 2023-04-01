import { Injectable } from '@angular/core';
import {Observable, from, of} from 'rxjs';
import {filter, toArray, map} from 'rxjs/operators';
interface Act{
  title: string,
  text:string
}
@Injectable({
  providedIn: 'root'
})
export class AtsModelService {
acts = [
  {title: 'no res civ', text:'<p><strong>ciao</strong> sono un testo in html con dei :documenti;</p>'},
  {title: 'no valida',text:'<p><strong>ciao</strong> sono un testo in html con dei documenti</p>'},
  {title: 'no niente',text:'<p><strong>ciao</strong> sono un testo in html con dei documenti</p>'},
  {title: 'no cose etc',text:'<p><strong>ciao</strong> sono un testo in html con dei documenti</p>'},
]
  constructor() { }
  getByName(name: string | null): Observable<Act[]> {
    if(name){
    return from(this.acts).pipe(
      filter((act:Act) => act.title.includes(name)),
      map((act:Act) => act),
      toArray()
    );
  }else{
    return of([]);
  }
}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


import { IObjectString } from '@app/common/IObiectString';
@Injectable({
  providedIn: 'root'
})
export class DatascStoreService {
  private datascArray$ = new BehaviorSubject<IObjectString>({});
  private idyoutube$ = new BehaviorSubject<string>('');

  constructor() { }

  setDatascArrayStore(datascArray: IObjectString): void {
    this.datascArray$.next(datascArray);
  }

  getDatascArrayStore(): Observable<IObjectString> {
    return this.datascArray$.asObservable();
  }
}

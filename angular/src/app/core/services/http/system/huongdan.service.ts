import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as Const from 'src/app/common/const';

import { BaseHttpService } from '../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class HuongdanService {
  constructor(public http: BaseHttpService) {}

  Create(params: any): Observable<any> {
    return this.http.post(Const.Tmt101Ant100Create, params, { needSuccessInfo: false });
  }

  Detail(id: string): Observable<any> {
    return this.http.post(Const.Tmt101Ant100GetDetail, { id: id }, { needSuccessInfo: false });
  }

  getIdyoutube(url: string): Observable<string> {
    return this.http.post(Const.Tmt101Ant100Detail, { urldisplayid: url }, { needSuccessInfo: false });
  } 

  Update(params: any): Observable<any> {
    return this.http.post(Const.Tmt101Ant100Update, params, { needSuccessInfo: false });
  }

  PostAll(params: any): Observable<any> {
    return this.http.post(Const.Tmt101Ant100FindAll, params, { needSuccessInfo: false });
  }

  PostSearchParams(params: any): Observable<any> {
    return this.http.post(Const.Tmt101Ant100Searchparam, params, { needSuccessInfo: false });
  }
}

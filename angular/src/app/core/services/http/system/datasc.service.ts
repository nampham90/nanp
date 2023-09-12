import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageInfo, SearchCommonVO } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import * as Const from 'src/app/common/const';

export interface DataScObj {
  idmenu: string;
  title1: string;
  title2: string;
  lang: string;
  vitri: number;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatascService {
  constructor(public http: BaseHttpService) {}

  public getDataSc(param: SearchCommonVO<DataScObj>): Observable<PageInfo<DataScObj>> {
    return this.http.post(Const.Ant100findAllDatasc, param);
  }

  public addDatasc(param: any): Observable<any> {
    return this.http.post(Const.Ant100AddListDatasc, param);
  }

  public delDatasc(id: any): Observable<any> {
    return this.http.post(Const.Ant100DelDatasc, { id: id });
  }

  public editDatasc(param: DataScObj): Observable<any> {
    return this.http.put(Const.Ant100EditDatasc, param);
  }

  public detailDatasc(id: any): Observable<any> {
    return this.http.post(Const.Ant100DetailDatasc, { id: id });
  }
}

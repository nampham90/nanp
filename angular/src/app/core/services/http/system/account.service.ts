import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as Const from 'src/app/common/const';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';
import { TMT010FILE } from '@app/model/tmt010_file.model';
/*
 * uản lý người dùng
 * */
export interface User {
  id: number;
  password: string;
  userName?: string;
  available?: boolean;
  roleName?: string[];
  sex?: 1 | 0;
  telephone?: string;
  mobile?: string | number;
  email?: string;
  lastLoginTime?: Date;
  oldPassword?: string;
  departmentId?: number;
  departmentName?: string;
  avatar?: TMT010FILE;
}

/*
 * Người dùng thay đổi mật khẩu
 * */
export interface UserPsd {
  id: string;
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(public http: BaseHttpService) {}

  public getAccount(param: SearchCommonVO<User>): Observable<any> {
    return this.http.post(Const.Ant100findAllUser, param);
  }

  public getAccountDetail(id: string): Observable<User> {
    return this.http.get(`${Const.Ant100GetDetailUser}/${id}/`);
  }

  public addAccount(param: User): Observable<void> {
    return this.http.post(Const.Ant100AddDetailUser, param);
  }

  public delAccount(ids: number[]): Observable<void> {
    return this.http.post('/user/del/', { ids });
  }

  public editAccount(param: User): Observable<void> {
    return this.http.put(Const.Ant100EditDetailUser, param);
  }

  public editAccountPsd(param: UserPsd): Observable<any> {
    return this.http.put(Const.Ant100ChangePasswordUser, param);
  }

  public checkEmail(param: string): Observable<boolean> {
    return this.http.post(Const.Ant100CheckEmailUser,{email:param});
  }

  public checkName(param: string): Observable<boolean> {
    return this.http.post(Const.Ant100CheckNameUser, {name: param});
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import * as Const from 'src/app/common/const';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';
/*
 *  quyền
 * */
export interface Permission {
  hasChildren: boolean;
  menuName: string;
  code: string;
  fatherId: number;
  id: number;
  menuGrade: number; // mức độ
  permissionVo: Permission[];
  isOpen?: boolean; // có nên gấp không
  checked: boolean;
}

// Cập nhật giao diện tham số quyền
export interface PutPermissionParam {
  permissionIds: string[];
  roleId: string;
}

/*
 * Vai trò
 * */
export interface Role {
  id?: string;
  rolename: string;
  mota?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(public http: BaseHttpService) {}

  public getRoles(param: SearchCommonVO<Role>): Observable<PageInfo<Role>> {
    return this.http.post(Const.Ant100SearchAllRole, param);
  }

  public getRolesDetail(id: string | number): Observable<Role> {
    return this.http.get(`${Const.Ant100GetDetailRole}/${id}/`);
  }

  public addRoles(param: Role): Observable<void> {
    return this.http.post(Const.Ant100AddDetailRole, param);
  }

  public delRoles(ids: number[]): Observable<void> {
    return this.http.post(Const.Ant100DelDetailRole, { ids });
  }

  public editRoles(param: Role): Observable<void> {
    return this.http.put(Const.Ant100EditDetailRole, param);
  }

  public getPermissionById(id: string): Observable<string[]> {
    return this.http.get(`${Const.Ant100GetPermissionRole}/${id}/`);
  }

  public updatePermission(param: PutPermissionParam): Observable<NzSafeAny> {
    return this.http.put(Const.Ant100PutPermissionRole, param);
  }
}

/*
 * Giao diện chung
 * */

import { Type } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UserInfo } from './store/common-store/userInfo.service';

// thành phần động
export class DynamicComponent {
  constructor(public component: Type<NzSafeAny>, public data: NzSafeAny) {}
}

// chọn thả xuống
export interface OptionsInterface {
  value: number | string;
  label: string;
}

// danh sách tìm kiếm
export interface SearchCommonVO<T> {
  pageNum: number;
  pageSize: number;
  filters?: T;
  userInfo?: UserInfo,
  data?: NzSafeAny
}

// phân trang
export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  size?: number;
  orderBy?: string;
  startRow?: number;
  endRow?: number;
  total: number;
  pages?: number;
  list: T[];
  firstPage?: number;
  prePage?: number;
  nextPage?: number;
  lastPage?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  navigatePages?: number;
  navigatepageNums?: number[];
}

// response
export interface Response<T> {
  code: number;
  msg: string;
  data?: PageInfo<T>;
}

// thành phần động
export interface AdComponent {
  data: NzSafeAny;
}

// Cấu trúc dữ liệu chọn tầng
export interface CascaderOption {
  value: number | string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

/*
 * Menu
 * */
export interface Menu {
  id: number | string;
  fatherId: number | string;
  path: string;
  menuName: string;
  menuType: 'C' | 'F'; // c: menu, f nút
  icon?: string; // Nếu showIcon sai, hãy đặt biểu tượng này làm biểu tượng ngoài cùng bên trái trong cửa sổ tìm kiếm
  alIcon?: string; //Nếu showIcon sai, hãy đặt biểu tượng này làm biểu tượng ngoài cùng bên trái trong cửa sổ tìm kiếm
  open?: boolean;
  selected?: boolean; // Nó đã được chọn chưa
  children?: Menu[];
  code?: string; // Mã quyền
  newLinkFlag?: 0 | 1; // Đây có phải là một trang mới?
  visible?: boolean;
  status?: boolean;
}

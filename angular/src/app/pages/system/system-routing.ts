import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'dept', pathMatch: 'full' },
  { path: 'menu', data: { title: 'Quản lý menu', key: 'menu' }, loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent) },
  { path: 'account', data: { title: 'Quản lý tài khoản', key: 'account' }, loadComponent: () => import('./account/account.component').then(m => m.AccountComponent) },
  { path: 'dept', data: { title: 'Quản lý bộ phận', key: 'dept' }, loadComponent: () => import('./dept/dept.component').then(m => m.DeptComponent) },
  { path: 'datasc', data: { title: 'Quản lý dử liệu SC', key: 'datasc' }, loadComponent: () => import('./datasc/datasc.component').then(m => m.DatascComponent) },
  { path: 'huongdan', data: { title: 'Hướng dẫn', key: 'huongdan'}, loadComponent: () => import('./huongdan/huongdan.component').then(m=>m.HuongdanComponent)} ,
  { path: 'role-manager', loadChildren: () => import('./role-manager/role-manage-routing') }
] as Route[];

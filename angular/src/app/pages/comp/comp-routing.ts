import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'transition', pathMatch: 'full' },
  { path: 'transition', data: { title: 'thành phần hoạt hình', key: 'transition' }, loadComponent: () => import('./transition/transition.component').then(m => m.TransitionComponent) },
  { path: 'basic', data: { title: 'Thành phần cơ bản', key: 'basic' }, loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent) },
  { path: 'lazy', loadChildren: () => import('./lazy/lazy-routing') },
  { path: 'luckysheet', data: { title: 'trực tuyến excel', key: 'luckysheet' }, loadComponent: () => import('./luckysheet/luckysheet.component').then(m => m.LuckysheetComponent) },
  { path: 'desc', data: { title: 'Thành phần chi tiết', key: 'desc' }, loadComponent: () => import('./desc/desc.component').then(m => m.DescComponent) },
  { path: 'strength-meter', data: { title: 'Thành phần độ mạnh mật khẩu', key: 'strength-meter' }, loadComponent: () => import('./strength-meter/strength-meter.component').then(m => m.StrengthMeterComponent) },
  { path: 'form', loadChildren: () => import('./form/form-routing') }
] as Route[];

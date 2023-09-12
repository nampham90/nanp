import { Route } from '@angular/router';
export default [
  { path: '', redirectTo: 'base-detail', pathMatch: 'full' },
  { path: 'base-detail', data: { title: 'Trang chi tiết cơ bản', key: 'base-detail' }, loadComponent: () => import('./base-detail/base-detail.component').then(m => m.BaseDetailComponent) },
  { path: 'adv-detail', data: { title: 'Trang chi tiết nâng cao', key: 'adv-detail' }, loadComponent: () => import('./adv-detail/adv-detail.component').then(m => m.AdvDetailComponent) }
] as Route[];

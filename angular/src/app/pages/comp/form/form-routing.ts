import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'shrink-form', pathMatch: 'full' },
  { path: 'shrink-form', data: { title: 'hình thức có thể mở rộng', key: 'shrink-form' }, loadComponent: () => import('./shrink-form/shrink-form.component').then(m => m.ShrinkFormComponent) },
  { path: 'append-form', data: { title: 'Các hình thức có thể được thêm hoặc xóa', key: 'append-form' }, loadComponent: () => import('./append-form/append-form.component').then(m => m.AppendFormComponent) }
] as Route[];

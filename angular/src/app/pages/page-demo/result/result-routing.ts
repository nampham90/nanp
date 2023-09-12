import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'role-manage', pathMatch: 'full' },
  { path: 'success', data: { title: 'Trang thành công', key: 'success' }, loadComponent: () => import('./success/success.component').then(m => m.SuccessComponent) },
  { path: 'fail', data: { title: 'Trang thất bại', key: 'fail' }, loadComponent: () => import('./fail/fail.component').then(m => m.FailComponent) }
] as Route[];

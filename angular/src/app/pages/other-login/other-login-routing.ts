import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'login1', pathMatch: 'full' },
  { path: 'login1', data: { title: 'Đăng nhập lần đầu', key: 'login1' }, loadComponent: () => import('./login1/login1.component').then(m => m.Login1Component) }
] as Route[];

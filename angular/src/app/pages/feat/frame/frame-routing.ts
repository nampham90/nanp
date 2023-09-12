import { Route } from '@angular/router';

export default [
  { path: 'zorro-doc', data: { title: 'tài liệu zorro', key: 'zorro-doc' }, loadComponent: () => import('./zorro-doc/zorro-doc.component').then(m => m.ZorroDocComponent) },
  { path: '', redirectTo: 'zorro-doc', pathMatch: 'full' }
] as Route[];

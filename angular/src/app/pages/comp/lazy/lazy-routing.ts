import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'lazy-basic', pathMatch: 'full' },
  { path: 'lazy-basic', data: { title: 'Tải các phiên bản cơ sở một cách lười biếng', key: 'lazy-basic' }, loadComponent: () => import('./lazy-basic/lazy-basic.component').then(m => m.LazyBasicComponent) },
  { path: 'lazy-scroll', data: { title: 'cuộn tải lười biếng', key: 'lazy-scroll' }, loadComponent: () => import('./lazy-scroll/lazy-scroll.component').then(m => m.LazyScrollComponent) }
] as Route[];

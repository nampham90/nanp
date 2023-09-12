import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'search-table', pathMatch: 'full' },
  { path: 'search-table', loadChildren: () => import('./search-table/search-table-routing') },
  { path: 'standard-table', data: { title: 'Mẫu', key: 'standard-table' }, loadComponent: () => import('./standard-table/standard-table.component').then(m => m.StandardTableComponent) },
  { path: 'tree-list', data: { title: 'Dạng cây', key: 'tree-list' }, loadComponent: () => import('./tree-list/tree-list.component').then(m => m.TreeListComponent) },
  { path: 'card-table', data: { title: 'Danh sách thẻ', key: 'card-table' }, loadComponent: () => import('./card-table/card-table.component').then(m => m.CardTableComponent) },
  { path: 'search-list', loadChildren: () => import('./search-list/search-list-routing') }
] as Route[];

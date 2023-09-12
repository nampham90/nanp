import { Route } from '@angular/router';

export default [
  { path: 'gaode-map', data: { title: 'Gaode', key: 'gaode-map' }, loadComponent: () => import('./gaode-map/gaode-map.component').then(m => m.GaodeMapComponent) },
  { path: 'baidu-map', data: { title: 'Baidu', key: 'baidu-map' }, loadComponent: () => import('./baidu-map/baidu-map.component').then(m => m.BaiduMapComponent) },
  { path: 'echarts', data: { title: 'Echarts', key: 'echarts' }, loadComponent: () => import('./echarts/echarts.component').then(m => m.EchartsComponent) },
  { path: '', redirectTo: 'gaode-map', pathMatch: 'full' }
] as Route[];

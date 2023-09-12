import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'analysis', pathMatch: 'full' },
  {
    path: 'analysis',
    data: { preload: true, title: 'Trang phân tích', key: 'analysis' },
    loadComponent: () => import('./analysis/analysis.component').then(m => m.AnalysisComponent)
  },
  { path: 'monitor', data: { title: 'Demo ReadTime', key: 'monitor' }, loadComponent: () => import('./monitor/monitor.component').then(m => m.MonitorComponent) },
  { path: 'workbench', data: { title: 'Bàn làm việc', key: 'workbench' }, loadComponent: () => import('./workbench/workbench.component').then(m => m.WorkbenchComponent) },
  { path: 'demo', data: {title: 'Demo', key: 'demo'}, loadComponent:()=> import('./demo/demo.component').then(m=>m.DemoComponent)}

] as Route[];

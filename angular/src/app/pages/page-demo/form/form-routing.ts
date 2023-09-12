import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'base-form', pathMatch: 'full' },
  { path: 'base-form', data: { title: 'Hình thức cơ bản', key: 'base-form' }, loadComponent: () => import('./base/base.component').then(m => m.BaseComponent) },
  { path: 'step-form', data: { title: 'Hình thức từng bước', key: 'step-form' }, loadComponent: () => import('./step/step.component').then(m => m.StepComponent) },
  { path: 'advanced-form', data: { title: 'Biểu mẫu nâng cao', key: 'advanced-form' }, loadComponent: () => import('./advanced/advanced.component').then(m => m.AdvancedComponent) }
] as Route[];

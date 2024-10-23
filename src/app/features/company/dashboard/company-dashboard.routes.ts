import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/company-dashboard/company-dashboard.component'),
  },
] as Routes;

import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/bank-dashboard/bank-dashboard.component'),
  },
] as Routes;

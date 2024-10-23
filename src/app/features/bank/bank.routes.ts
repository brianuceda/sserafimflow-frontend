import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/bank-dashboard.routes'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
] as Routes;

import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/company-dashboard.routes'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
] as Routes;

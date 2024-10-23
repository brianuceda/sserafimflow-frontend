import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile/profile.component'),
  },
  {
    path: 'bancos',
    loadComponent: () => import('./banks/banks.component'),
  },
  {
    path: 'carteras',
    loadChildren: () => import('./portfolios/portfolios.routes'),
  },
  {
    path: 'documentos',
    loadChildren: () => import('./documents/documents.routes'),
  },
  {
    path: 'ventas',
    loadChildren: () => import('./sales/sales.routes'),
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reports/reports.component'),
  },
  {
    path: 'documentacion',
    loadChildren: () => import('../../shared/features/docs/docs.routes'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
] as Routes;

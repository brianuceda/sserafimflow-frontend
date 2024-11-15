import { Routes } from '@angular/router';
import { CompanyGuard } from '../../core/role.guards';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile/profile/profile.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'bancos',
    loadComponent: () => import('./banks/pages/show-banks/show-banks.component'),
    canActivate: [CompanyGuard],
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
    canActivate: [CompanyGuard],
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

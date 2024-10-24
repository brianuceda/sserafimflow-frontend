import { Routes } from '@angular/router';
import { BankGuard } from '../../core/role.guards';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canActivate: [BankGuard],
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile/profile/profile.component'),
    canActivate: [BankGuard],
  },
  {
    path: 'empresas',
    loadComponent: () => import('./companies/companies.component'),
    canActivate: [BankGuard],
  },
  {
    path: 'documentos',
    loadChildren: () => import('./documents/documents.routes'),
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reports/reports.component'),
    canActivate: [BankGuard],
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

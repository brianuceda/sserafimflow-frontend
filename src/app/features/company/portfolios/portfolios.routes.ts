import { Routes } from '@angular/router';
import { CompanyGuard } from '../../../core/role.guards';

export default [
  {
    path: 'mostrar',
    loadComponent: () => import('./pages/show-portfolios/show-portfolios.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'asignar-documentos',
    loadComponent: () => import('./pages/assign-documents-to-portfolio/assign-documents-to-portfolio.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'asignar-documentos/:id',
    loadComponent: () => import('./pages/assign-documents-to-portfolio/assign-documents-to-portfolio.component'),
    canActivate: [CompanyGuard],
  },
] as Routes;

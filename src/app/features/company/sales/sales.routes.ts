import { Routes } from '@angular/router';
import { CompanyGuard } from '../../../core/role.guards';

export default [
  {
    path: 'vender-documento',
    loadComponent: () => import('./pages/sell-document/sell-document.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'documentos-vendidos',
    loadComponent: () => import('./pages/show-sold-documents/show-sold-documents.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'ventas-cobradas',
    loadComponent: () => import('./pages/show-collected-sales/show-collected-sales.component'),
    canActivate: [CompanyGuard],
  },
] as Routes;

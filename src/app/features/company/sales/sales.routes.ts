import { Routes } from '@angular/router';
import { CompanyGuard } from '../../../core/role.guards';

export default [
  {
    path: 'mostrar',
    loadComponent: () => import('./pages/show-sales/show-sales.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'vender-documento',
    loadComponent: () => import('./pages/sell-document/sell-document.component'),
    canActivate: [CompanyGuard],
  },
] as Routes;

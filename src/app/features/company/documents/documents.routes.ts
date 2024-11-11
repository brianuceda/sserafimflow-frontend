import { Routes } from '@angular/router';
import { CompanyGuard } from '../../../core/role.guards';

export default [
  {
    path: 'mostrar',
    loadComponent: () => import('./pages/show-documents/show-documents.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'crear-modificar',
    loadComponent: () => import('./pages/create-modify-document/create-modify-document.component'),
    canActivate: [CompanyGuard],
  },
  {
    path: 'crear-modificar/:id',
    loadComponent: () => import('./pages/create-modify-document/create-modify-document.component'),
    canActivate: [CompanyGuard],
  },
] as Routes;

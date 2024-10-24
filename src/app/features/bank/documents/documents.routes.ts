import { Routes } from '@angular/router';
import { BankGuard } from '../../../core/role.guards';

export default [
  {
    path: 'comprados',
    loadComponent: () => import('./pages/purchased/purchased.component'),
    canActivate: [BankGuard],
  },
  {
    path: 'pagados',
    loadComponent: () => import('./pages/paid/paid.component'),
    canActivate: [BankGuard],
  },
] as Routes;

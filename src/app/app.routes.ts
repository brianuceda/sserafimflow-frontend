import { Routes } from '@angular/router';
import { PublicGuard } from './core/auth.guards';
import { BankGuard, CompanyGuard } from './core/role.guards';

export const routes: Routes = [
  // Lading Page
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.routes'),
  },
  // Rutas Públicas
  {
    path: 'empresa',
    loadChildren: () => import('./auth/company/auth-company.routes'),
    canActivate: [PublicGuard],
  },
  {
    path: 'banco',
    loadChildren: () => import('./auth/bank/auth-bank.routes'),
    canActivate: [PublicGuard],
  },
  // Usuarios autenticados
  {
    path: 'app',
    loadComponent: () => import('./shared/ui/layout-private/layout-private.component'),
    children: [
      {
        path: 'empresa',
        loadChildren: () => import('./features/company/company.routes'),
      },
      {
        path: 'banco',
        loadChildren: () => import('./features/bank/bank.routes'),
      },
      {
        path: '**',
        redirectTo: '/app/empresa',
      }
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

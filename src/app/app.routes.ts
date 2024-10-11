import { Routes } from '@angular/router';
import { PrivateGuard, PublicGuard } from './core/auth.guards';

export const routes: Routes = [
  // Rutas Públicas
  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full',
  },
  {
    canActivate: [PublicGuard],
    path: '',
    loadComponent: () => import('./shared/ui/layout-public/layout-public.component'),
    loadChildren: () => import('./auth/auth.routes'),
  },
  // Rutas Privadas
  {
    path: 'app',
    canActivate: [PrivateGuard],
    loadComponent: () => import('./shared/ui/layout-private/layout-private.component'),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
        canActivate: [PrivateGuard],
      },
      {
        path: 'bancos',
        loadChildren: () => import('./features/bank/bank.routes'),
        canActivate: [PrivateGuard],
      },
      {
        path: 'docs',
        loadChildren: () => import('./features/docs/docs.routes'),
        canActivate: [PrivateGuard],
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'iniciar-sesion',
  },
];

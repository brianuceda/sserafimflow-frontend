import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full',
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/register/register.component'),
  },
] as Routes;

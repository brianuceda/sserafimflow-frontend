import { Routes } from '@angular/router';

export default [
  // Español
  {
    path: 'empresa/iniciar-sesion',
    loadComponent: () => import('./pages/company/login/login.component'),
  },
  {
    path: 'empresa/registrarse',
    loadComponent: () => import('./pages/company/register/register.component'),
  },
  {
    path: 'banco/iniciar-sesion',
    loadComponent: () => import('./pages/bank/login/login.component'),
  },
  {
    path: 'banco/registrarse',
    loadComponent: () => import('./pages/bank/register/register.component'),
  },
] as Routes;

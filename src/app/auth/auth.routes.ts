import { Routes } from '@angular/router';

export default [
  // Español
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/signup/signup.component'),
  },
] as Routes;

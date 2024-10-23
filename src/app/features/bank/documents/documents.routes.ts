import { Routes } from '@angular/router';

export default [
  {
    path: 'comprados',
    loadComponent: () => import('./pages/purchased/purchased.component'),
  },
  {
    path: 'pagados',
    loadComponent: () => import('./pages/paid/paid.component'),
  },
] as Routes;

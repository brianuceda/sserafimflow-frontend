import { Routes } from '@angular/router';

export default [
  {
    path: 'mostrar',
    loadComponent: () => import('./pages/show-portfolios/show-portfolios.component'),
  },
  {
    path: 'asignar-documentos',
    loadComponent: () => import('./pages/assign-documents-to-portfolio/assign-documents-to-portfolio.component'),
  },
  {
    path: 'eliminar',
    loadComponent: () => import('./pages/delete-portfolio/delete-portfolio.component'),
  },
] as Routes;

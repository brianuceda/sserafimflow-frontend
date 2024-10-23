import { Routes } from '@angular/router';

export default [
  {
    path: 'mostrar',
    loadComponent: () => import('./pages/show-documents/show-documents.component'),
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/create-modify-document/create-modify-document.component'),
  },
  {
    path: 'eliminar',
    loadComponent: () => import('./pages/delete-document/delete-document.component'),
  },
] as Routes;

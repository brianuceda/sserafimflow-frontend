import { Routes } from '@angular/router';

export default [
  {
    path: 'vender-documento',
    loadComponent: () => import('./pages/sell-document/sell-document.component'),
  },
  {
    path: 'documentos-vendidos',
    loadComponent: () => import('./pages/show-sold-documents/show-sold-documents.component'),
  },
  {
    path: 'ventas-cobradas',
    loadComponent: () => import('./pages/show-collected-sales/show-collected-sales.component'),
  },
] as Routes;

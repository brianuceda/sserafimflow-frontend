import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/listar-bancos/listar-bancos.component'),
  },
] as Routes;

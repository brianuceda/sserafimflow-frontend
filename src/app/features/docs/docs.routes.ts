import { Routes } from '@angular/router';

export default [
  {
    path: 'funcionalidad',
    children: [
      {
        path: 'ejemplo',
        loadComponent: () => import('./pages/functionality/functionality.component'),
      }
    ]
  },
  {
    path: 'componentes',
    loadComponent: () => import('./pages/components/components.component'),
  },
  {
    path: 'apexcharts',
    loadComponent: () => import('./pages/apexcharts/apexcharts.component'),
  },
  {
    path: 'echarts',
    loadComponent: () => import('./pages/echarts/echarts.component'),
  },
] as Routes;

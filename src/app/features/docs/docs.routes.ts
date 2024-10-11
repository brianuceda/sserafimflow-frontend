import { Routes } from '@angular/router';

export default [
  {
    path: 'funcionamiento',
    loadComponent: () => import('./pages/functionality/functionality.component'),
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

import { SidebarItem } from "../models/sidebar.model";

export const sidebarData: SidebarItem[] = [
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    title: 'Dashboard',
    route: 'dashboard',
  },
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l18 0" /><path d="M3 10l18 0" /><path d="M5 6l7 -3l7 3" /><path d="M4 10l0 11" /><path d="M20 10l0 11" /><path d="M8 14l0 3" /><path d="M12 14l0 3" /><path d="M16 14l0 3" /></svg>`,
    title: 'Bancos',
    route: 'bancos',
  },
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: 'Users',
    route: 'users',
    childrens: [
      {
        title: 'Hijo 1',
        route: 'hijo1',
        childrens: [
          { title: 'Nieto 1', route: 'nieto1' },
          { title: 'Nieto 2', route: 'nieto2' },
          { title: 'Nieto 3', route: 'nieto3' },
        ],
      },
      {
        title: 'Hijo 2',
        route: 'hijo2',
        childrens: [
          { title: 'Nieto 1', route: 'nieto4' },
          { title: 'Nieto 2', route: 'nieto5' },
          { title: 'Nieto 3', route: 'nieto6' },
        ],
      },
    ],
  },
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/></svg>`,
    title: 'Account',
    route: 'account',
    childrens: [
      { title: 'Hijo 1', route: 'hijo1' },
      { title: 'Hijo 2', route: 'hijo2' },
      { title: 'Hijo 3', route: 'hijo3' },
    ],
  },
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    title: 'Documentación',
    route: 'docs',
    childrens: [
      {
        title: 'Funcionalidad',
        route: 'funcionalidad',
        childrens: [
          { title: 'Ejemplo', route: 'ejemplo' }
        ]
      },
      {
        title: 'Componentes',
        route: 'componentes'
      },
      {
        title: 'ApexCharts',
        route: 'apexcharts'
      },
      {
        title: 'ECharts',
        route: 'echarts'
      },
    ],
  },
  {
    icon: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 9m0 1.105a1.105 1.105 0 0 1 1.105 -1.105h1.79a1.105 1.105 0 0 1 1.105 1.105v9.79a1.105 1.105 0 0 1 -1.105 1.105h-1.79a1.105 1.105 0 0 1 -1.105 -1.105z" /><path d="M17 3m0 1.105a1.105 1.105 0 0 1 1.105 -1.105h1.79a1.105 1.105 0 0 1 1.105 1.105v15.79a1.105 1.105 0 0 1 -1.105 1.105h-1.79a1.105 1.105 0 0 1 -1.105 -1.105z" /><path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /></svg>`,
    title: 'Reportes',
    route: 'dashboard',
  },
];

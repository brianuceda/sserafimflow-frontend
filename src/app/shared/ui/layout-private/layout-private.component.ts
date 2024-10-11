import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { TestChartsComponent } from '../../../tests/test-charts/test-charts.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout-private',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    TestChartsComponent,
  ],
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss',
})
export default class LayoutPrivateComponent {}

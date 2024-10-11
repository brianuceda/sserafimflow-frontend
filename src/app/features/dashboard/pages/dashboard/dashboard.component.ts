import { Component } from '@angular/core';
import { TestChartsComponent } from '../../../../tests/test-charts/test-charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TestChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {

}

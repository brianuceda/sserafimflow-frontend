import { Component } from '@angular/core';
import { ChartOptions } from '../../../shared/data-access/models/chart.model';
import { ChartApexchartsComponent } from '../../../shared/components/chart-apexcharts/chart-apexcharts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartApexchartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {
  public chartOptions1!: Partial<ChartOptions>;

  ngOnInit() {
    this.loadChart1();
  }

  loadChart1() {
    this.chartOptions1 = {

    };
  }
}

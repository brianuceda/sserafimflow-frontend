import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../data-access/models/chart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-apexcharts',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './chart-apexcharts.component.html',
  styleUrl: './chart-apexcharts.component.scss'
})
export class ChartApexchartsComponent implements AfterViewInit {
  @Input() chartOptions!: Partial<ChartOptions>;

  @ViewChild('chart') chartElement!: ElementRef;

  ngAfterViewInit() {
    this.loadChart();
  }
  
  loadChart() {
    this.chartOptions = {
      ...this.chartOptions,
      theme: {
        mode: 'dark',
        palette: 'palette1', // hasta palette10
      },
      responsive: [
        {
          breakpoint: 1000,
        },
      ],
    };
  }
}

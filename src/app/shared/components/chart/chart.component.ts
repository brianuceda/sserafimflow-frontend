import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../data-access/chart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  @Input() chartOptions!: Partial<ChartOptions>;

  @ViewChild('chart') chartElement!: ElementRef;

  ngOnInit() {
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

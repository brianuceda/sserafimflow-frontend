import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NgApexchartsModule,
  ApexTheme,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ApexAnnotations,
  ApexFill,
  ApexForecastDataPoints,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexPlotOptions,
  ApexStates,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  annotations?: ApexAnnotations;
  chart?: ApexChart ;
  colors?: string[];
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  forecastDataPoints?: ApexForecastDataPoints;
  grid?: ApexGrid;
  labels: string[];
  legend?: ApexLegend;
  markers?: ApexMarkers;
  noData?: ApexNoData;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  series?: ApexAxisChartSeries | number[];
  states?: ApexStates;
  stroke?: ApexStroke;
  subtitle?: ApexTitleSubtitle;
  theme: ApexTheme; // *
  title?: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
};

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

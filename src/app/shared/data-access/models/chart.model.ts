import {
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

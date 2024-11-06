import { MathjaxEcuationComponent } from '../../../../../shared/components/mathjax-ecuation/mathjax-ecuation.component';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ChartOptions } from '../../../../../shared/data-access/models/chart.model';
import { ChartApexchartsComponent } from '../../../../../shared/components/chart-apexcharts/chart-apexcharts.component';
import { DashboardService } from '../../data-access/services/dashboard.service';
import { Dashboard } from '../../data-access/models/dashboard.model';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MathjaxEcuationComponent, ChartApexchartsComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {
  public selectedCurrency: 'PEN' | 'USD' = 'PEN';
  public showExchangeRateTable: boolean = false;
  public dashboardData: Dashboard = {
    totalNominalValueIssued: '0',
    totalNominalValueReceived: '0',
    totalNominalValueDiscounted: '0',
    pendingPortfoliosToPay: 0,
    cantSoldLettersPerMonth: [],
    cantSoldInvoicesPerMonth: [],
    amountSoldLettersPerMonth: [],
    amountSoldInvoicesPerMonth: [],
    exchangeRate: {
      date: Date.now().toString(),
      currencyRates: [],
    },
  }
  // Tasa de cambio
  public exchangeRateHeadersDisplayedNames = ['Nombre de la Moneda', 'Moneda', 'Precio de Compra', 'Precio de Venta'];
  public exchangeRateHeadersDisplayed = ['currencyname', 'currency', 'purchaseprice', 'saleprice'];
  public exchangeRateData: any[] = [];
  // Gráficos
  public chartOptions1!: Partial<ChartOptions>;
  public chartOptions2!: Partial<ChartOptions>;

  private _dashboardService = inject(DashboardService);
  private _cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    this.loadChart1();
    this.loadChart2();

    this._cdr.detectChanges();
    this.callApi(this.selectedCurrency);
  }

  changeSelectedCurrency(event: Event) {
    this.selectedCurrency = (event.target as HTMLSelectElement).value as 'PEN' | 'USD';
    this.callApi(this.selectedCurrency);
  }

  callApi(targetCurrency: 'PEN' | 'USD') {
    this._dashboardService.getDashboard(targetCurrency).subscribe((data: Dashboard) => {
      this.dashboardData = data;
      this.dashboardData.totalNominalValueIssued = this.formatNumber(data.totalNominalValueIssued, targetCurrency);
      this.dashboardData.totalNominalValueReceived = this.formatNumber(data.totalNominalValueReceived, targetCurrency);
      this.dashboardData.totalNominalValueDiscounted = this.formatNumber(data.totalNominalValueDiscounted, targetCurrency);

      let date: number[] = (data.exchangeRate.date as string).split('-').map(Number);
      this.dashboardData.exchangeRate.date = new Date(date[0], (date[1] - 1), date[2]).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      this.exchangeRateData = [];
      this.dashboardData.exchangeRate.currencyRates.forEach((rate: any) => {
        this.exchangeRateData.push({
          currencyname: rate.currencyName,
          currency: rate.currency,
          purchaseprice: rate.purchasePrice,
          saleprice: rate.salePrice,
        });
      });

      this.changeDataChart1();
      this.changeDataChart2();
    });
  }

  private formatNumber(value: string, targetCurrency: 'PEN' | 'USD') {
    return parseFloat(value).toLocaleString('es-PE', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }

  loadChart1() {
    this.chartOptions1 = {
      series: [
        {
          name: 'Letras vendidas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Facturas vendidas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 2.5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
      },
      yaxis: {
        title: {
          text: 'documentos',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + ' documento(s)';
          },
        },
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
      },
      responsive: [
        {
          breakpoint: 1000,
        },
      ],
    };
  }

  loadChart2() {
    this.chartOptions2 = {
      series: [
        {
          name: 'Monto por letras vendidas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Monto por facturas vendidas',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
      },
      yaxis: {
        title: {
          text: 'dinero',
        },
        labels: {
          formatter: (val: number) => val.toFixed(0)
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: any) => {
            return this.formatNumber(val, this.selectedCurrency);
          },
        },
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
      },
      responsive: [
        {
          breakpoint: 1000,
        },
      ],
    };
  }

  changeDataChart1() {
    this.chartOptions1 = {
      ...this.chartOptions1,
      series: [
        {
          name: 'Letras vendidas',
          data: this.dashboardData.cantSoldLettersPerMonth,
        },
        {
          name: 'Facturas vendidas',
          data: this.dashboardData.cantSoldInvoicesPerMonth,
        },
      ],
    }
  }

  changeDataChart2() {
    this.chartOptions2 = {
      ...this.chartOptions2,
      series: [
        {
          name: 'Monto por letras vendidas',
          data: this.dashboardData.amountSoldLettersPerMonth,
        },
        {
          name: 'Monto por facturas vendidas',
          data: this.dashboardData.amountSoldInvoicesPerMonth,
        },
      ],
    }
  }
}

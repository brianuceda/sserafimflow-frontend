import { MathjaxEcuationComponent } from '../../../../../shared/components/mathjax-ecuation/mathjax-ecuation.component';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ChartOptions } from '../../../../../shared/data-access/models/chart.model';
import { ChartApexchartsComponent } from '../../../../../shared/components/chart-apexcharts/chart-apexcharts.component';
import { DashboardService } from '../../data-access/services/dashboard.service';
import { Dashboard } from '../../data-access/models/dashboard.model';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { DashboardSocketService } from '../../data-access/services/dashboard-socket.service';
import { CompanyService } from '../../../profile/data-access/services/company.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { toast } from 'ngx-sonner';
import { CurrencyEnum } from '../../../../../shared/data-access/models/enums.model';
import { Company } from '../../../../../shared/data-access/models/company.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MathjaxEcuationComponent, ChartApexchartsComponent, TableComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {
  public isLoading: boolean = true;
  public selectedCurrency: CurrencyEnum = CurrencyEnum.PEN;
  public showExchangeRateTable: boolean = false;
  public dashboardData!: Dashboard;
  // Tasa de cambio
  public exchangeRateHeadersDisplayedNames = ['Nombre de la Moneda', 'Moneda', 'Precio de Compra', 'Precio de Venta'];
  public exchangeRateHeadersDisplayed = ['currencyname', 'currency', 'purchaseprice', 'saleprice'];
  public exchangeRateData: any[] = [];
  // Gráficos
  public chartOptions1!: Partial<ChartOptions>;
  public chartOptions2!: Partial<ChartOptions>;

  private _dashboardService = inject(DashboardService);
  private _companyService = inject(CompanyService);
  private _dashboardSocketService = inject(DashboardSocketService);
  private _cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    this.loadChart1();
    this.loadChart2();

    this.detectChangesWebSocket();
    this.callApi();
  }

  changeCurrency(event: any) {
    this.selectedCurrency = event.target.value;
    
    let company: Partial<Company> = {
      previewDataCurrency: this.selectedCurrency
    };

    console.log(company);

    this._companyService.updateCompanyProfile(company).subscribe((data: any) => {
      toast.info(data.message);
      this.callApi(this.selectedCurrency);
    });
  }

  callApi(targetCurrency?: CurrencyEnum) {
    this._dashboardService.getDashboard(targetCurrency).subscribe((data: Dashboard) => {
      this.updateData(data);
      this.isLoading = false;
    });
  }

  detectChangesWebSocket() {
    this._dashboardSocketService.getDashboardUpdates().subscribe((data: Dashboard) => {
      this.updateData(data);
    });
  }

  updateData(data: Dashboard) {
    this.dashboardData = data;
    this.selectedCurrency = data.mainCurrency;
    this.formatChanges(data);

    this._cdr.detectChanges();
  }

  formatChanges(data: Dashboard) {
    this.dashboardData.totalNominalValueIssued = this.formatNumber(data.totalNominalValueIssued, this.selectedCurrency);
    this.dashboardData.totalNominalValueReceived = this.formatNumber(data.totalNominalValueReceived, this.selectedCurrency);
    this.dashboardData.totalNominalValueDiscounted = this.formatNumber(data.totalNominalValueDiscounted, this.selectedCurrency);

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
  }

  private formatNumber(value: string, targetCurrency: CurrencyEnum) {
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
      yaxis: {
        title: {
          text: 'documentos',
        },
      },
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
      yaxis: {
        title: {
          text: 'dinero',
        },
        labels: {
          formatter: (val: number) => {
            // Si algun valor es distinto de 0, formatea los valores a 2 decimales
            let hasNonZeroValue = this.dashboardData.amountSoldInvoicesPerMonth.some((value: number) => value != 0);
            return hasNonZeroValue ? val.toFixed(2) : val.toString();
          }
        },
      },
    }
  }
}

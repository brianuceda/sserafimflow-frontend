import { MathjaxEcuationComponent } from '../../../../../shared/components/mathjax-ecuation/mathjax-ecuation.component';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  ChartApexchartsComponent,
  ChartOptions,
} from '../../../../../shared/components/chart-apexcharts/chart-apexcharts.component';
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
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { DashboardPrintComponent } from '../dashboard-print/dashboard-print.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MathjaxEcuationComponent,
    ChartApexchartsComponent,
    TableComponent,
    LoaderComponent,
    DashboardPrintComponent,
    NgxPrintModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  public isLoading: true | false | null = true;
  public previewDataCurrency: CurrencyEnum = CurrencyEnum.PEN;
  public showExchangeRateTable: boolean = false;
  public dashboardData!: Dashboard;
  
  // Tasa de cambio
  public exchangeRateHeadersDisplayedNames = [
    'Nombre de la Moneda',
    'Moneda',
    'Precio de Compra',
    'Precio de Venta',
  ];
  public exchangeRateHeadersDisplayed = [
    'currencyname',
    'currency',
    'purchaseprice',
    'saleprice',
  ];
  public exchangeRateData: any[] = [];

  // Gráficos
  public chartOptions1!: Partial<ChartOptions>;
  public chartOptions2!: Partial<ChartOptions>;

  private _dashboardService = inject(DashboardService);
  private _companyService = inject(CompanyService);
  private _cdr = inject(ChangeDetectorRef);

  // viewchild a printSection
  @ViewChild('printSection') printSection?: ElementRef;

  ngOnInit() {
    this.loadChart1();
    this.loadChart2();

    this.detectChangesWebSocket();
    this.callApi();
  }

  changeCurrency(event: any) {
    this.previewDataCurrency = event.target.value;

    let company: Partial<Company> = {
      previewDataCurrency: this.previewDataCurrency,
    };

    this._companyService
      .updateCompanyProfile(company)
      .subscribe((data: any) => {
        toast.info('Moneda de visualización actualizada');
        this.callApi(this.previewDataCurrency);
      });
  }

  callApi(targetCurrency?: CurrencyEnum) {
    this._dashboardService.getDashboard(targetCurrency).subscribe({
      next: (data) => {
        this.updateData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        // Set default values on error to prevent template rendering issues
        this.dashboardData = {
          totalNominalValueIssued: '0',
          totalNominalValueReceived: '0',
          totalNominalValueDiscounted: '0',
          mostUsedBankForSales: 'N/A',
          mostUsedPeriodRate: 'NOMINAL',
          mostUsedCurrency: 'PEN',
          cantSoldLettersPerMonth: Array(12).fill(0),
          cantSoldInvoicesPerMonth: Array(12).fill(0),
          amountSoldLettersPerMonth: Array(12).fill(0),
          amountSoldInvoicesPerMonth: Array(12).fill(0),
          mainCurrency: this.previewDataCurrency
        } as Dashboard;
        
        this.isLoading = null;
      },
    });
  }

  detectChangesWebSocket() {
    // this._dashboardSocketService.getDashboardUpdates().subscribe({
    //   next: (data: Dashboard) => {
    //     this.updateData(data);
    //     this.isLoading = false;
    //   },
    //   error: (error: any) => {
    //     console.error(error);
    //     this.isLoading = null;
    //   }
    // })
  }

  updateData(data: Dashboard) {
    this.dashboardData = data;
    if (data && data.mainCurrency) {
      this.previewDataCurrency = data.mainCurrency?.toString() as CurrencyEnum;
    }
    this.formatChanges(data);

    this._cdr.detectChanges();
  }

  formatChanges(data: Dashboard) {
    if (!data) return;
    
    if (data.totalNominalValueIssued) {
      this.dashboardData.totalNominalValueIssued = this.formatNumber(
        data.totalNominalValueIssued,
        this.previewDataCurrency
      );
    }
    
    if (data.totalNominalValueReceived) {
      this.dashboardData.totalNominalValueReceived = this.formatNumber(
        data.totalNominalValueReceived,
        this.previewDataCurrency
      );
    }
    
    if (data.totalNominalValueDiscounted) {
      this.dashboardData.totalNominalValueDiscounted = this.formatNumber(
        data.totalNominalValueDiscounted,
        this.previewDataCurrency
      );
    }

    if (this.dashboardData && this.dashboardData.todayExchangeRate) {
      let date: number[] = (data.todayExchangeRate?.date as string)
        .split('-')
        .map(Number);
      this.dashboardData.todayExchangeRate.date = new Date(
        date[0],
        date[1] - 1,
        date[2]
      ).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      this.exchangeRateData = [];
      if (this.dashboardData.todayExchangeRate.currencyRates) {
        this.dashboardData.todayExchangeRate.currencyRates.forEach(
          (rate: any) => {
            this.exchangeRateData.push({
              currencyname: rate.currencyName,
              currency: rate.currency,
              purchaseprice: rate.purchasePrice,
              saleprice: rate.salePrice,
            });
          }
        );
      }
    }

    this.changeDataChart1();
    this.changeDataChart2();
  }

  private formatNumber(value: string | number, targetCurrency: CurrencyEnum) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
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
            return this.formatNumber(val, this.previewDataCurrency);
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
    if (!this.dashboardData) return;
    
    this.chartOptions1 = {
      ...this.chartOptions1,
      series: [
        {
          name: 'Letras vendidas',
          data: this.dashboardData.cantSoldLettersPerMonth || Array(12).fill(0),
        },
        {
          name: 'Facturas vendidas',
          data: this.dashboardData.cantSoldInvoicesPerMonth || Array(12).fill(0),
        },
      ],
      yaxis: {
        title: {
          text: 'documentos',
        },
      },
    };
  }

  changeDataChart2() {
    if (!this.dashboardData) return;
    
    this.chartOptions2 = {
      ...this.chartOptions2,
      series: [
        {
          name: 'Monto por letras vendidas',
          data: this.dashboardData.amountSoldLettersPerMonth || Array(12).fill(0),
        },
        {
          name: 'Monto por facturas vendidas',
          data: this.dashboardData.amountSoldInvoicesPerMonth || Array(12).fill(0),
        },
      ],
      yaxis: {
        title: {
          text: 'dinero',
        },
        labels: {
          formatter: (val: number) => {
            // Si algun valor es distinto de 0, formatea los valores a 2 decimales
            if (!this.dashboardData || !this.dashboardData.amountSoldInvoicesPerMonth) {
              return val.toString();
            }
            
            let hasNonZeroValue =
              this.dashboardData.amountSoldInvoicesPerMonth.some(
                (value: number) => value != 0
              );
            return hasNonZeroValue ? val.toFixed(2) : val.toString();
          },
        },
      },
    };
  }

  exportAsDPF() {
    if (this.printSection) {
      this.printSection.nativeElement.style.display = 'block';
      this.printSection.nativeElement.style.display = 'none';
    }
  }

  exportAsJSON() {
    let onlyDashboardData = { ...this.dashboardData };
    delete onlyDashboardData.todayExchangeRate;
    delete onlyDashboardData.mainCurrency;

    const exportData = {
      dashboardData: onlyDashboardData,
      previewDataCurrency: this.previewDataCurrency,
      exchangeRateData: this.exchangeRateData,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `Dashboard Data - ${new Date().toLocaleDateString(
      'es-PE',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    )}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

import { Component, Input } from '@angular/core';
import { Dashboard } from '../../data-access/models/dashboard.model';
import { CurrencyEnum } from '../../../../../shared/data-access/models/enums.model';
import { MathjaxEcuationComponent } from '../../../../../shared/components/mathjax-ecuation/mathjax-ecuation.component';
import { CurrencyRate } from '../../../../../shared/data-access/models/exchange-rate.mode';

@Component({
  selector: 'app-dashboard-print',
  standalone: true,
  imports: [MathjaxEcuationComponent],
  templateUrl: './dashboard-print.component.html',
  styleUrl: './dashboard-print.component.scss'
})
export class DashboardPrintComponent {
  public months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  // dd de mmmm de yyyy
  public todayDate = new Date().getDate() + ' de ' + this.months[new Date().getMonth()] + ' de ' + new Date().getFullYear();

  @Input() dashboardData!: Dashboard;
  @Input() previewDataCurrency!: CurrencyEnum;
  @Input() exchangeRateData!: any[];
  
  public formatNumber(value: string | number) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
      style: 'currency',
      currency: this.previewDataCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }
}

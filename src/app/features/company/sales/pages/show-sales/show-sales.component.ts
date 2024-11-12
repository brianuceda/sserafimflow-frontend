import { Component, inject } from '@angular/core';
import { CurrencyEnum, StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { PurchasedDocument } from '../../../../../shared/data-access/models/purchase.model';
import { SalesService } from '../../services/sales.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventEmitted, TableComponent } from '../../../../../shared/components/table/table.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-sales',
  standalone: true,
  imports: [LoaderComponent, FormsModule, CommonModule, TableComponent],
  templateUrl: './show-sales.component.html',
  styleUrl: './show-sales.component.scss'
})
export default class ShowSalesComponent {
  public eventsList: EventEmitted[] = [
    {
      title: 'Reiniciar tabla',
      svg: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path></svg>`,
      emitEvents: 'resetTableConfig'
    }
  ];

  public isLoading: true | false | null = true;
  public selectedState: StateEnum = StateEnum.ALL;
  
  documentsPurchased: PurchasedDocument[] = [];

  public headersDisplayedNames: string[] = [];
  public headersDisplayed: string[] = [];
  public selectedColumns: Set<number> = new Set();
  public dataTable: any[] = [];
  
  public lowerSelectedSearchTerm?: string;
  public searchInput: string = '';

  private _salesService = inject(SalesService);
  private _activateRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit() {
    this.logQueryParams();
    this.loadData();
  }

  private logQueryParams() {
    this._activateRoute.queryParams.subscribe((params) => {
      const paramKeys = Object.keys(params);
  
      if (paramKeys.length === 1) {
        this.lowerSelectedSearchTerm = paramKeys[0].toLowerCase();
        this.searchInput = params[paramKeys[0]];
      }
    });
  }
  
  private formatNumber(value: string | number, targetCurrency: CurrencyEnum) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }

  changeState(event: any) {
    this.selectedState = event.target.value;

    // Reinicia los parámetros de la URL
    this._router.navigate([], {
      queryParams: {}
    });
    this.lowerSelectedSearchTerm = undefined;
    this.searchInput = '';

    // Vuelve a cargar los datos
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._salesService.getAllDocumentsPurchased(this.selectedState).subscribe({
      next: (documents) => {
        this.documentsPurchased = documents;
        this.isLoading = false;
        
        this.convertDataToTable();
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }
  convertDataToTable() {
    let havePayDate = this.documentsPurchased.some((document: PurchasedDocument) => document.payDate);

    if (havePayDate) {
      this.headersDisplayed = ['id', 'purchasedate', 'paydate', 'state', 'currency', 'nominalvalue', 'discountrate', 'receivedvalue', 'days', 'tep', 'ratetype', 'ratevalue', 'bank'];
      this.headersDisplayedNames = ['ID', 'Fecha de Venta', 'Fecha de Pago', 'Estado', 'Moneda', 'Valor Nominal', 'Tasa Descontada', 'Valor Recibido', 'Días', 'TEP', 'Tipo de Tasa', 'Valor de Tasa', 'Comprador'];
    } else {
      this.headersDisplayed = ['id', 'purchasedate', 'state', 'currency', 'nominalvalue', 'discountrate', 'receivedvalue', 'days', 'tep', 'ratetype', 'ratevalue', 'bank'];
      this.headersDisplayedNames = ['ID', 'Fecha de Venta', 'Estado', 'Moneda', 'Valor Nominal', 'Tasa Descontada', 'Valor Recibido', 'Días', 'TEP', 'Tipo de Tasa', 'Valor de Tasa', 'Comprador'];
    }
    
    this.selectedColumns = new Set([]);

    let documentTypes: { [key: string]: string } = {
      'INVOICE': 'Factura',
      'LETTER': 'Letra de Cambio',
    };

    let currencies: { [key: string]: string } = {
      'PEN': 'Soles Peruanos',
      'USD': 'Dólares Americanos',
    };

    let states: { [key: string]: string } = {
      'NOT_SELLED': 'No Vendido',
      'PENDING': 'Pendiente',
      'PAID': 'Cobrado',
    };

    let rates: { [key: string]: string } = {
      'NOMINAL': 'Nominal',
      'EFFECTIVE': 'Efectiva',
    };

    this.dataTable = this.documentsPurchased.map((document: PurchasedDocument) => {
      return {
        id: document.id,
        purchasedate: document.purchaseDate.split('-').reverse().join('/'),
        paydate: this.formatTimestamp(document.payDate),
        state: document.state in states ? states[document.state] : document.state,
        currency: document.currency in currencies ? currencies[document.currency] : document.currency,
        nominalvalue: this.formatNumber(document.nominalValue, document.currency as CurrencyEnum),
        discountrate: document.discountRate * 100,
        receivedvalue: this.formatNumber(document.receivedValue, document.currency as CurrencyEnum),
        days: document.days,
        tep: document.tep * 100,
        ratetype: document.rateType in rates ? rates[document.rateType] : document.rateType,
        ratevalue: document.rateValue * 100,
        bank: {
          name: document.bank.realName,
          url: '/app/empresa/bancos?id=' + document.bank.id,
          imageurl: document.bank.imageUrl,
        }
      };
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()} - ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
    return formattedDate;
  }
}

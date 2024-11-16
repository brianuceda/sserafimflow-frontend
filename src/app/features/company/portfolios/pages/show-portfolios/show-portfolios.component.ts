import { Component, inject } from '@angular/core';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { PortfoliosService } from '../../data-access/services/portfolios.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '../../../../../shared/data-access/models/document.model';
import { CurrencyEnum } from '../../../../../shared/data-access/models/enums.model';
import { TableComponent } from '../../../../../shared/components/table/table.component';

@Component({
  selector: 'app-show-portfolios',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './show-portfolios.component.html',
  styleUrl: './show-portfolios.component.scss',
})
export default class ShowPortfoliosComponent {
  documentsHeadersDisplayed: string[] = [
    'id',
    'documenttype',
    'amount',
    'clientname',
  ];
  documentsHeadersDisplayedNames: string[] = [
    'ID',
    'Tipo',
    'Monto',
    'Cliente',
  ];

  public viewNamesDocumentTypes: { [key: string]: string } = {
    INVOICE: 'Factura',
    LETTER: 'Letra de Cambio',
  };
  public viewNamesCurrencies: { [key: string]: string } = {
    PEN: 'Soles Peruanos',
    USD: 'Dólares Americanos',
  };
  public viewNamesStates: { [key: string]: string } = {
    NOT_SELLED: 'No Vendida',
    PENDING: 'Pendiente',
    PAID: 'Cobrada',
  };
  public viewDocsNamesStates: { [key: string]: string } = {
    NOT_SELLED: 'No Vendido',
    PENDING: 'Pendiente',
    PAID: 'Cobrado',
  };
  public viewNamesRates: { [key: string]: string } = {
    NOMINAL: 'Nominal',
    EFFECTIVE: 'Efectiva',
  };

  public isLoading: true | false | null = true;

  public listData: any[] = [];
  public filteredListData: any[] = [];

  selectedPortfolioId!: number;

  searchInput: string = '';
  lowerSelectedSearchTerm: string = 'id';

  private _portfoliosService = inject(PortfoliosService);
  private _router = inject(Router);
  private _activateRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.getSearchParamsFromURL();
    this.loadData();
  }

  getSearchParamsFromURL() {
    this._activateRoute.queryParams.subscribe((params) => {
      const paramKeys = Object.keys(params);

      if (paramKeys.length === 1) {
        this.lowerSelectedSearchTerm =
          paramKeys[0] as typeof this.lowerSelectedSearchTerm;
        this.searchInput = params[paramKeys[0]];
      }

      this.updateShowedData();
    });
  }

  loadData() {
    this._portfoliosService.getAllPortfolios().subscribe({
      next: (data: Portfolio[]) => {
        this.listData = data.map((item) => ({
          ...item,
        }));

        this.filteredListData = this.listData;
        this.updateShowedData();

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      },
    });
  }

  onOptionSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.lowerSelectedSearchTerm = target.value as string;
      this.updateShowedData();
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value.toLowerCase().trim();
    this.updateShowedData();
  }

  updateShowedData() {
    if (this.searchInput && this.lowerSelectedSearchTerm) {
      this.filteredListData = this.listData.filter((item) => {
        const field =
          item[this.lowerSelectedSearchTerm as keyof Partial<Portfolio>];

        return (
          field && field.toString().toLowerCase().includes(this.searchInput)
        );
      });
    } else {
      this.filteredListData = [...this.listData];
    }

    this.changePortfoliosNames();
  }

  assignDocumentsToPortfolioId(portfolioId: number) {
    this._router.navigate(['/app/empresa/carteras/asignar-documentos'], {
      queryParams: { portfolioId },
    });
  }

  changePortfoliosNames() {
    this.filteredListData = this.filteredListData.map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      state: this.viewNamesStates[portfolio.state] || portfolio.state,
      documents: this.changeDocumentsNames(portfolio.documents),
    }));
  }

  changeDocumentsNames(documents: any[]): any[] {
    return documents.map((doc) => ({
      id: doc.id,
      documenttype:
        this.viewNamesDocumentTypes[doc.documentType] || doc.documentType,
      // amount: doc.currency,
      amount: this.formatNumber(doc.amount, doc.currency as CurrencyEnum),
      discountdate: doc.discountDate?.split('-').reverse().join('/'),
      clientname: doc.clientName,
    }));
  }

  private formatNumber(value: string | number, targetCurrency?: CurrencyEnum) {
    try {
      let valueFormatted;

      if (targetCurrency) {
        valueFormatted = parseFloat(value.toString()).toLocaleString('es-PE', {
          style: 'currency',
          currency: targetCurrency,
          minimumFractionDigits: 1,
          maximumFractionDigits: 3,
        });
      } else {
        valueFormatted = parseFloat(value.toString()).toLocaleString('es-PE', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 3,
        });
      }

      return valueFormatted;
    } catch (error) {
      console.error(error);
      return value;
    }
  }
}

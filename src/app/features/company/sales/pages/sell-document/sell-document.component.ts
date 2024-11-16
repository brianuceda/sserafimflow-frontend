import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { SalesService } from '../../services/sales.service';
import {
  CurrencyEnum,
  RateTypeEnum,
  StateEnum,
} from '../../../../../shared/data-access/models/enums.model';
import { PurchasedDocument } from '../../../../../shared/data-access/models/purchase.model';
import { BanksService } from '../../../banks/data-access/services/banks.service';
import { DocumentsService } from '../../../documents/data-access/services/documents.service';
import { Bank } from '../../../../../shared/data-access/models/bank.model';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  EventEmitted,
  TableComponent,
} from '../../../../../shared/components/table/table.component';
import { MathjaxEcuationComponent } from '../../../../../shared/components/mathjax-ecuation/mathjax-ecuation.component';
import {
  DiscountedRate,
  PurchaseEquations,
  ReceivedValue,
  Tep,
} from '../../models/ecuations.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sell-document',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    TableComponent,
    MathjaxEcuationComponent,
  ],
  templateUrl: './sell-document.component.html',
  styleUrl: './sell-document.component.scss',
})
export default class SellDocumentComponent {
  public eventsList: EventEmitted[] = [
    {
      title: 'Reiniciar tabla',
      svg: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path></svg>`,
      emitEvents: 'resetTableConfig',
    },
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
    NOT_SELLED: 'No Vendido',
    PENDING: 'Pendiente',
    PAID: 'Cobrado',
  };
  public viewNamesRates: { [key: string]: string } = {
    NOMINAL: 'Nominal',
    EFFECTIVE: 'Efectiva',
  };

  isLoading: true | false | null = true;

  public lowerSelectedSearchTerm?: string;
  public searchInput: string = '';

  banksHeadersDisplayed: string[] = [
    'id',
    'realname',
    'maincurrency',
    'nominalrate',
    'effectiverate',
  ];
  banksHeadersDisplayedNames: string[] = [
    'ID',
    'Nombre',
    'Moneda Principal',
    'Tasa Nominal',
    'Tasa Efectiva',
  ];
  banks: any[] = [];

  documentsHeadersDisplayed: string[] = [
    'id',
    'documenttype',
    'amount',
    'currency',
    'discountdate',
    'clientname',
  ];
  documentsHeadersDisplayedNames: string[] = [
    'ID',
    'Tipo de Documento',
    'Monto',
    'Moneda',
    'Fecha de Descuento',
    'Nombre del Cliente',
  ];
  documents: any[] = [];

  rates: any[] = [
    { value: 'NOMINAL', viewValue: 'Nominal' },
    { value: 'EFFECTIVE', viewValue: 'Efectiva' },
  ];

  selectedDocument = new FormControl<number | null>(null);
  selectedBank = new FormControl<number | null>(null);
  selectedRateType = new FormControl<string>('');

  purchaseEquations!: PurchaseEquations;

  readonly _salesService = inject(SalesService);
  readonly _banksService = inject(BanksService);
  readonly _documentsService = inject(DocumentsService);

  readonly _activateRoute = inject(ActivatedRoute);
  readonly _router = inject(Router);

  ngOnInit() {
    this.loadData();
    this.tryToDoCalcs();
  }

  private tryToDoCalcs() {
    this.selectedDocument.valueChanges.subscribe(() => {
      if (
        this.selectedDocument.value !== null &&
        this.selectedBank.value !== null &&
        this.selectedRateType.value !== ''
      ) {
        this.doCalcs();
      }
    });

    this.selectedBank.valueChanges.subscribe(() => {
      if (
        this.selectedDocument.value !== null &&
        this.selectedBank.value !== null &&
        this.selectedRateType.value !== ''
      ) {
        this.doCalcs();
      }
    });

    this.selectedRateType.valueChanges.subscribe(() => {
      if (
        this.selectedDocument.value !== null &&
        this.selectedBank.value !== null &&
        this.selectedRateType.value !== ''
      ) {
        this.doCalcs();
      }
    });
  }

  private doCalcs() {
    this._salesService
      .calculatePurchase(
        this.selectedBank.value!,
        this.selectedDocument.value!,
        this.selectedRateType.value
      )
      .subscribe({
        next: (purchaseEquations: PurchaseEquations) => {
          this.purchaseEquations = purchaseEquations;
          this.purchaseEquations.tep.value =
            this.purchaseEquations.tep.value + ' %';
          this.purchaseEquations.discountedRate.value =
            this.purchaseEquations.discountedRate.value + ' %';
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  sellDocument() {
    if (
      this.selectedDocument.value === null || this.selectedDocument.value === undefined ||
      this.selectedBank.value === null ||this.selectedBank.value === undefined ||
      this.selectedRateType.value === ''
    ) {
      return;
    }

    this._salesService
      .sellDocument(
        this.selectedBank.value!,
        this.selectedDocument.value!,
        this.selectedRateType.value
      )
      .subscribe({
        next: (response: any) => {
          this._router.navigate(['/app/empresa/ventas/mostrar']);
          toast.success(response.message);
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  private logQueryParams() {
    this._activateRoute.queryParams.subscribe((params) => {
      const paramKeys = Object.keys(params);

      if (paramKeys.length === 1) {
        this.lowerSelectedSearchTerm = paramKeys[0].toLowerCase();
        this.searchInput = params[paramKeys[0]];

        const ids = this.searchInput.split(',').map(Number);
        const validIds = ids.filter((id) =>
          this.documents.some((doc) => doc.id === id)
        );
        this.selectedDocument.setValue(validIds[0]);
      }
    });
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

  loadData() {
    this.isLoading = true;
    this._documentsService.getAllDocuments(StateEnum.NOT_SELLED).subscribe({
      next: (documents: SharedDocument[]) => {
        this.documents = documents;
        this._banksService.getAllBanksAssociated().subscribe({
          next: (banks: Bank[]) => {
            this.banks = banks;

            this.logQueryParams();
            this.changeNames();
          },
          error: (error: any) => {
            this.isLoading = null;
            console.error(error);
          },
        });
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      },
    });
  }

  changeNames() {
    this.banks = this.banks.map((bank) => ({
      id: bank.id,
      realname: bank.realName,
      maincurrency:
        this.viewNamesCurrencies[bank.mainCurrency] || bank.mainCurrency,
      nominalrate:
        this.formatNumber(
          bank.nominalRate * 100,
          bank.currency as CurrencyEnum
        ) + ' %',
      effectiverate:
        this.formatNumber(
          bank.effectiveRate * 100,
          bank.currency as CurrencyEnum
        ) + ' %',
    }));

    this.documents = this.documents.map((doc) => ({
      id: doc.id,
      documenttype:
        this.viewNamesDocumentTypes[doc.documentType] || doc.documentType,
      amount: this.formatNumber(doc.amount, doc.currency as CurrencyEnum),
      currency: this.viewNamesCurrencies[doc.currency] || doc.currency,
      discountdate: doc.discountDate?.split('-').reverse().join('/'),
      clientname: doc.clientName,
    }));

    this.isLoading = false;
  }
}

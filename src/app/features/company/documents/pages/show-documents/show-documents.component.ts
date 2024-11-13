import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../data-access/services/documents.service';
import {
  CurrencyEnum,
  DocumentTypeEnum,
  StateEnum,
} from '../../../../../shared/data-access/models/enums.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  EventEmitted,
  TableComponent,
} from '../../../../../shared/components/table/table.component';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDeleteDocumentComponent } from '../../modal/confirm-delete-document/confirm-delete-document.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-show-documents',
  standalone: true,
  imports: [LoaderComponent, FormsModule, CommonModule, TableComponent],
  templateUrl: './show-documents.component.html',
  styleUrl: './show-documents.component.scss',
})
export default class ShowDocumentsComponent {
  public viewNamesDocumentTypes: { [key: string]: string } = {
    INVOICE: 'Factura',
    LETTER: 'Letra de Cambio',
  };

  public eventsList: EventEmitted[] = [
    {
      title: 'Agregar a Cartera',
      svg: `<svg class="size-[18px]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"/></svg>`,
      emitEvents: 'emitEvents',
      pathToGo: '/app/empresa/carteras/crear-modificar',
    },
    {
      title: 'Vender',
      svg: `<svg class="size-[18px]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2"></path><path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5"></path></svg>`,
      emitEvents: 'emitEvents',
      pathToGo: '/app/empresa/ventas/vender-documento',
    },
    {
      title: 'Reiniciar tabla',
      svg: `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path></svg>`,
      emitEvents: 'resetTableConfig',
    },
  ];

  public isLoading: true | false | null = true;
  public selectedState: StateEnum = StateEnum.ALL;

  documents: SharedDocument[] = [];

  public headersDisplayedNames: string[] = [];
  public headersDisplayed: string[] = [];
  public selectedColumns: Set<number> = new Set();
  public dataTable: any[] = [];

  public lowerSelectedSearchTerm?: string;
  public searchInput: string = '';

  readonly _documentsService = inject(DocumentsService);

  readonly _activateRoute = inject(ActivatedRoute);
  readonly _router = inject(Router);
  readonly _dialog = inject(MatDialog);

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

  emitEditRow(id: Event) {
    this._router.navigate(['/app/empresa/documentos/crear-modificar/', id]);
  }

  emitDeleteRow(id: Event) {
    const document = this.documents.find((doc) => doc.id === Number(id));
  
    if (!document) {
      console.error(`Documento con ID ${Number(id)} no encontrado.`);
      return;
    }

    let documentType = this.viewNamesDocumentTypes[document.documentType] || document.documentType;
    let amount = this.formatNumber(document.amount, document.currency as CurrencyEnum);
    let client = document.clientName;
  
    const dialogRef = this._dialog.open(ConfirmDeleteDocumentComponent, {
      data: {
        title: 'Eliminar Documento',
        message: `¿Desea eliminar la ${documentType} de ${amount} de ${client}?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed' && document.id) {
        this._documentsService.deleteDocument(document.id).subscribe({
          next: () => {
            toast.success('Documento eliminado correctamente');
            this.loadData();
          },
          error: (error) => {
            console.error(error);
          }
        });
      } else if (result === 'cancelled') {
        console.log('Operación cancelada');
      }
    });
  }

  private formatNumber(value: string | number, targetCurrency: CurrencyEnum) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }

  changeState(event: any) {
    this.selectedState = event.target.value;

    // Reinicia los parámetros de la URL
    this._router.navigate([], {
      queryParams: {},
    });
    this.lowerSelectedSearchTerm = undefined;
    this.searchInput = '';

    // Vuelve a cargar los datos
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._documentsService.getAllDocuments(this.selectedState).subscribe({
      next: (data: SharedDocument[]) => {
        this.documents = data;
        this.isLoading = false;

        this.convertDataToTable();
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      },
    });
  }

  convertDataToTable() {
    this.headersDisplayed = [
      'id',
      'documenttype',
      'amount',
      'currency',
      'issuedate',
      'discountdate',
      'expirationdate',
      'state',
      'clientname',
      'clientphone',
      'portfolio',
    ];
    this.headersDisplayedNames = [
      'ID',
      'Tipo de Documento',
      'Monto',
      'Moneda',
      'Fecha de Emisión',
      'Fecha de Descuento',
      'Fecha de Vencimiento',
      'Estado',
      'Nombre del Cliente',
      'Teléfono del Cliente',
      'Cartera',
    ];
    this.selectedColumns = new Set([]);

    // this.dataTable.push(
    //   {
    //     id: 1,
    //     documenttype: 'Factura',
    //     amount: 'S/ 100.00',
    //     currency: 'Soles Peruanos',
    //     issuedate: '9/11/2024',
    //     duedate: '27/11/2024',
    //     state: 'No Vendido',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    //   {
    //     id: 2,
    //     documenttype: 'Letra de Cambio',
    //     amount: 'S/ 200.00',
    //     currency: 'Soles Peruanos',
    //     issuedate: '9/11/2024',
    //     duedate: '27/11/2024',
    //     state: 'Pendiente',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    //   {
    //     id: 3,
    //     documenttype: 'Factura',
    //     amount: 'S/ 300.00',
    //     currency: 'Soles Peruanos',
    //     issuedate: '9/11/2024',
    //     duedate: '27/11/2024',
    //     state: 'Cobrado',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    //   {
    //     id: 4,
    //     documenttype: 'Letra de Cambio',
    //     amount: 'S/ 400.00',
    //     currency: 'Soles Peruanos',
    //     issuedate: '9/11/2024',
    //     duedate: '27/11/2024',
    //     state: 'No Vendido',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    //   {
    //     id: 5,
    //     documenttype: 'Factura',
    //     amount: 'S/ 500.00',
    //     currency: 'Soles Peruanos',
    //     issuedate: '9/11/2024',
    //     duedate: '27/11/2024',
    //     state: 'Cobrado',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    // );

    let documentTypes: { [key: string]: string } = {
      INVOICE: 'Factura',
      LETTER: 'Letra de Cambio',
    };

    let currencies: { [key: string]: string } = {
      PEN: 'Soles Peruanos',
      USD: 'Dólares Americanos',
    };

    let states: { [key: string]: string } = {
      NOT_SELLED: 'No Vendido',
      PENDING: 'Pendiente',
      PAID: 'Cobrado',
    };

    this.dataTable = this.documents.map((document: SharedDocument) => {
      let portfolio = '-';
      if (document.portfolio) {
        portfolio =
          '[' + document.portfolio.id + '] ' + document.portfolio.name;
      }

      return {
        id: document.id,
        portfolio: portfolio,
        documenttype:
          document.documentType in documentTypes
            ? documentTypes[document.documentType]
            : document.documentType,
        amount: this.formatNumber(
          document.amount,
          document.currency as CurrencyEnum
        ),
        currency:
          document.currency in currencies
            ? currencies[document.currency]
            : document.currency,
        issuedate: document.issueDate.split('-').reverse().join('/'),
        discountdate: document.discountDate.split('-').reverse().join('/'),
        expirationdate: document.expirationDate.split('-').reverse().join('/'),
        state:
          document.state in states ? states[document.state] : document.state,
        clientname: document.clientName,
        clientphone: document.clientPhone,
      };
    });
  }
}

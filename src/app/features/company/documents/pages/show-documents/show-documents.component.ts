import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../data-access/services/documents.service';
import { CurrencyEnum, StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';

@Component({
  selector: 'app-show-documents',
  standalone: true,
  imports: [LoaderComponent, FormsModule, CommonModule, TableComponent],
  templateUrl: './show-documents.component.html',
  styleUrl: './show-documents.component.scss',
})
export default class ShowDocumentsComponent {
  public isLoading: true | false | null = true;
  public selectedState: StateEnum = StateEnum.ALL;

  documents: SharedDocument[] = [];
  
  public headersDisplayedNames: string[] = [];
  public headersDisplayed: string[] = [];
  public selectedColumns: Set<number> = new Set();
  public dataTable: any[] = [];

  private _documentsService = inject(DocumentsService);

  ngOnInit() {
    this.loadData();
  }

  private formatNumber(value: string | number, targetCurrency: CurrencyEnum) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }

  changeCurrency(event: any) {
    this.selectedState = event.target.value;
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
    this.headersDisplayed = ['id', 'documenttype', 'amount', 'currency', 'issuedate', 'duedate', 'state', 'clientname', 'clientphone'];
    this.headersDisplayedNames = ['ID', 'Tipo de Documento', 'Monto', 'Moneda', 'Fecha de Emisión', 'Fecha de Vencimiento', 'Estado', 'Nombre del Cliente', 'Teléfono del Cliente'];
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
    //     state: 'Pagado',
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
    //     state: 'Pagado',
    //     clientname: 'Juan Perez',
    //     clientphone: '999888777',
    //   },
    // );

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
      'PAID': 'Pagado',
    };

    this.dataTable = this.documents.map((document) => {
      return {
        id: document.id,
        documenttype: document.documentType in documentTypes ? documentTypes[document.documentType] : document.documentType,
        amount: this.formatNumber(document.amount, document.currency as CurrencyEnum),
        currency: document.currency in currencies ? currencies[document.currency] : document.currency,
        issuedate: document.issueDate.split('-').reverse().join('/'),
        duedate: document.dueDate.split('-').reverse().join('/'),
        state: document.state in states ? states[document.state] : document.state,
        clientname: document.clientName,
        clientphone: document.clientPhone,
      };
    });

    console.log(this.dataTable);
  }
}

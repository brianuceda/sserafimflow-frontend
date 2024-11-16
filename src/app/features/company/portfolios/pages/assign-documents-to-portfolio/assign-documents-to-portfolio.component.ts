import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../../documents/data-access/services/documents.service';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';
import {
  CurrencyEnum,
  StateEnum,
} from '../../../../../shared/data-access/models/enums.model';
import {
  EventEmitted,
  TableComponent,
} from '../../../../../shared/components/table/table.component';
import { PortfoliosService } from '../../data-access/services/portfolios.service';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { MatDialog } from '@angular/material/dialog';
import { hasAnyError } from '../../../../../shared/utils/form-validators';
import { toast } from 'ngx-sonner';
import CreateModifyPortfolioComponent from '../create-modify-portfolio/create-modify-portfolio.component';
import { DialogAngularMaterialComponent } from '../../../../../shared/components/dialog-angular-material/dialog-angular-material.component';

@Component({
  selector: 'app-assign-documents-to-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    TableComponent,
  ],
  templateUrl: './assign-documents-to-portfolio.component.html',
  styleUrl: './assign-documents-to-portfolio.component.scss',
})
export default class AssignDocumentsToPortfolioComponent {
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
    NOT_SELLED: 'No Vendida',
    PENDING: 'Pendiente',
    PAID: 'Cobrada',
  };
  public viewNamesRates: { [key: string]: string } = {
    NOMINAL: 'Nominal',
    EFFECTIVE: 'Efectiva',
  };

  isLoading: true | false | null = false;

  isTableDocumentsLoading: true | false | null = false;
  isTablePortfoliosLoading: true | false | null = false;

  portfoliosHeadersDisplayed: string[] = [
    'id',
    'name',
    'state',
    'documentssize',
  ];
  portfoliosHeadersDisplayedNames: string[] = [
    'ID',
    'Nombre',
    'Estado',
    'Cantidad de Documentos',
  ];
  portfolios: any[] = [];

  documentsHeadersDisplayed: string[] = [
    'id',
    'documenttype',
    'amount',
    'currency',
    'discountdate',
    'state',
    'clientname',
  ];
  documentsHeadersDisplayedNames: string[] = [
    'ID',
    'Tipo de Documento',
    'Monto',
    'Moneda',
    'Fecha de Descuento',
    'Estado',
    'Nombre del Cliente',
  ];
  documents: any[] = [];

  ids: number[] = [];
  portfolioId!: number;

  selectedPortfolio = new FormControl<number | null>(null);
  selectedDocuments = new FormControl<number[]>([]);

  private _activateRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  private _documentsService = inject(DocumentsService);
  private _portfoliosService = inject(PortfoliosService);
  readonly _dialog = inject(MatDialog);

  ngOnInit() {
    this.loadData();

    this.selectedPortfolio.valueChanges.subscribe(() => {
      if (this.selectedPortfolio.value != null) {
        this.searchDocumentsInPortfolio(this.selectedPortfolio.value);
      }
    });
  }

  emitEditRow(id: Event) {
    const dialogRef = this._dialog.open(CreateModifyPortfolioComponent, {
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.loadData();
      } else if (result === 'cancelled') {
        console.log('Operación cancelada');
      }
    });
  }

  emitDeleteRow(id: Event) {
    const portfolio = this.portfolios.find(
      (portfolio) => portfolio.id === Number(id)
    );

    if (!portfolio) {
      console.error(`Cartera con ID ${Number(id)} no encontrado.`);
      return;
    }

    let portfolioId = portfolio.id;
    let documentsCant = portfolio.documentssize.split(' ')[0];

    const dialogRef = this._dialog.open(DialogAngularMaterialComponent, {
      data: {
        title: 'Eliminar Cartera',
        message: `¿Desea eliminar la cartera ${portfolioId} de con ${documentsCant} documento(s)? No se borrarán los documentos, solo se desvincularán de la cartera.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed' && portfolioId) {
        this._portfoliosService.removePortfolio(portfolioId).subscribe({
          next: (data) => {
            toast.success(data.message);
            this.loadData();
          },
          error: (error) => {
            toast.error(error.error.message);
            console.error(error);
          },
        });
        console.log('Cartera eliminada correctamente');
      } else if (result === 'cancelled') {
        console.log('Operación cancelada');
      }
    });
  }

  changeState(newState: 'create' | 'forceCreate' | 'select') {
    if (newState === 'create' || newState === 'forceCreate') {
      let dialogRef;

      if (newState === 'create') {
        dialogRef = this._dialog.open(CreateModifyPortfolioComponent, {});
      }

      if (newState === 'forceCreate') {
        dialogRef = this._dialog.open(CreateModifyPortfolioComponent, {
          disableClose: true,
        });
      }

      dialogRef!.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.loadData();
        }
      });
    } else {
      this.loadData();
    }
  }

  searchDocumentsInPortfolio(portfolioId: number) {
    this.isTableDocumentsLoading = true;

    this._portfoliosService.getPortfolioById(portfolioId).subscribe({
      next: (portfolio: Portfolio) => {
        let documentsOfSelectedPortfolio = portfolio.documents || [];

        this._documentsService
          .getAllDocumentsExceptingPortfolioId(portfolioId)
          .subscribe({
            next: (documents: SharedDocument[]) => {
              this.documents = documents;

              if (this.ids.length > 0) {
                documentsOfSelectedPortfolio = [
                  ...documentsOfSelectedPortfolio,
                  ...this.documents.filter(
                    (doc) =>
                      doc.id !== undefined &&
                      this.ids.includes(doc.id) &&
                      !documentsOfSelectedPortfolio.some((d) => d.id === doc.id)
                  ),
                ];
              }

              const selectedDocumentIds = documentsOfSelectedPortfolio
                .map((doc) => doc.id)
                .filter((id): id is number => id !== undefined);

              this.selectedDocuments.setValue(selectedDocumentIds);

              this.changeDocumentsNames();

              this.isTableDocumentsLoading = false;
            },
            error: (err) => {
              console.error(err);
            },
          });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  searchPortfolioInParams() {
    this._activateRoute.queryParams.subscribe((params) => {
      const portfolioId = params['portfolioId'];

      if (portfolioId) {
        let numberPortfolioId = Number(portfolioId);

        // si numberPortfolioId está dentro de los ids disponibles en this.portfolios, entonces se selecciona
        if (this.portfolios.some((portfolio) => portfolio.id === numberPortfolioId)) {
          this.selectedPortfolio.setValue(numberPortfolioId);
          this.searchDocumentsInPortfolio(numberPortfolioId);
        }
      }
    });
  }

  tryEditRowByIdParam() {
    this._activateRoute.params.subscribe((params) => {
      const id = params['id'];

      if (id) {
        this.emitEditRow(id);
      }
    });
  }

  loadData() {
    this.isLoading = true;

    this._activateRoute.queryParams.subscribe((params) => {
      this.ids = params['ids'] ? params['ids'].split(',').map(Number) : [];
    });

    this._portfoliosService.getAllPortfolios().subscribe({
      next: (portfolios: any[]) => {
        this.portfolios = portfolios;

        this._documentsService.getAllDocumentsNotInAnyPortfolio().subscribe({
          next: (documents: SharedDocument[]) => {
            this.documents = documents;

            this.changePortfoliosNames();
            this.changeDocumentsNames();

            if (this.ids.length > 0) {
              this.logQueryParams();
            }

            if (this.portfolios.length === 0) {
              this.changeState('forceCreate');
            } else {
              this.searchPortfolioInParams();
              this.tryEditRowByIdParam();
            }

            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = null;
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  logQueryParams() {
    // Filtrar los IDs que coinciden con los IDs en documentList
    const validIds = this.ids.filter((id: number) =>
      this.documents.some((doc) => doc.id === id)
    );

    // Actualizar selectedDocuments solo con los IDs válidos
    this.selectedDocuments.setValue(validIds);

    // Actualizar los parámetros de la URL para reflejar solo los IDs válidos
    this._router.navigate([], {
      relativeTo: this._activateRoute,
      queryParams: { ids: validIds.join(',') },
      queryParamsHandling: 'merge',
    });
  }

  changePortfoliosNames() {
    this.portfolios = this.portfolios.map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      state: this.viewNamesStates[portfolio.state] || portfolio.state,
      documentssize: (portfolio.documents?.length || 0) + ' documento(s)',
    }));
  }

  changeDocumentsNames() {
    this.documents = this.documents.map((doc) => ({
      id: doc.id,
      documenttype:
        this.viewNamesDocumentTypes[doc.documentType] || doc.documentType,
      // amount: doc.currency,
      amount: this.formatNumber(doc.amount),
      currency: this.viewNamesCurrencies[doc.currency] || doc.currency,
      discountdate: doc.discountDate?.split('-').reverse().join('/'),
      state: this.viewNamesStates[doc.state] || doc.state,
      clientname: doc.clientName,
    }));
  }

  changeDocuments() {
    const selectedPortfolio: number = this.selectedPortfolio.value as number;
    const selectedDocuments: number[] = this.selectedDocuments
      .value as number[];

    if (selectedPortfolio === null || selectedDocuments === null) {
      return;
    }

    this._portfoliosService
      .changeDocumentsOfPortfolio(selectedPortfolio, selectedDocuments)
      .subscribe({
        next: (data) => {
          toast.success(data.message);

          this._activateRoute.queryParams.subscribe((params) => {
            const { ids, ...remainingParams } = params;
            this._router.navigate([], {
              relativeTo: this._activateRoute,
              queryParams: remainingParams,
              queryParamsHandling: '',
            });
          });

          this.selectedPortfolio.setValue(null);
          this.selectedDocuments.setValue(null);

          this.loadData();
        },
        error: (err) => {
          console.error(err);
        },
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
}

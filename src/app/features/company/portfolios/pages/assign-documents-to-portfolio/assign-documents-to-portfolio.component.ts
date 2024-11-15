import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../../documents/data-access/services/documents.service';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';
import { StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { TableComponent } from '../../../../../shared/components/table/table.component';

@Component({
  selector: 'app-assign-documents-to-portfolio',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, LoaderComponent, TableComponent],
  templateUrl: './assign-documents-to-portfolio.component.html',
  styleUrl: './assign-documents-to-portfolio.component.scss',
})
export default class AssignDocumentsToPortfolioComponent {
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

  public isEditting: boolean = false;
  public isLoading: true | false | null = false;

  selectedDocuments = new FormControl<number[]>([]);
  documentList: SharedDocument[] = [];

  private _activateRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _documentsService = inject(DocumentsService);

  ngOnInit() {
    this.isLoading = true;

    this._activateRoute.queryParams.subscribe((params) => {
      const ids = params['ids'] ? params['ids'].split(',').map(Number) : [];

      if (ids.length > 0) {
        this._documentsService.getAllDocumentsNotInAnyPortfolio().subscribe({
          next: (documents: SharedDocument[]) => {
            this.documentList = documents;

            // Filtrar los IDs que coinciden con los IDs en documentList
            const validIds = ids.filter((id: number) => documents.some((doc) => doc.id === id));

            // Actualizar selectedDocuments solo con los IDs válidos
            this.selectedDocuments.setValue(validIds);

            // Actualizar los parámetros de la URL para reflejar solo los IDs válidos
            this._router.navigate([], {
              relativeTo: this._activateRoute,
              queryParams: { ids: validIds.join(',') },
              queryParamsHandling: 'merge',
            });

            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = null;
          },
        });
      } else {
        this._documentsService.getAllDocuments(StateEnum.ALL).subscribe({
          next: (documents: SharedDocument[]) => {
            this.documentList = documents;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = null;
          },
        });
      }
    });
  }
}

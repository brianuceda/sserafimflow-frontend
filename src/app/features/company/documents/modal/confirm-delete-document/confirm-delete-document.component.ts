import { Component, inject } from '@angular/core';
import { DocumentsService } from '../../data-access/services/documents.service';

@Component({
  selector: 'app-confirm-delete-document',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-document.component.html',
  styleUrl: './confirm-delete-document.component.scss'
})
export class ConfirmDeleteDocumentComponent {
  private _documentsService = inject(DocumentsService);

  confirmDelete() {
    this._documentsService.deleteDocument('documentId').subscribe({
      next: () => {
        this._documentsService.getAllDocuments().subscribe({
          next: (documents) => {
            return documents;
          },
          error: (error) => {
            console.error(error);
          }
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

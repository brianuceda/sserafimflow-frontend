import { Component, inject } from '@angular/core';
import { DocumentsService } from '../../data-access/services/documents.service';
import { toast } from 'ngx-sonner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-document',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-document.component.html',
  styleUrl: './confirm-delete-document.component.scss'
})
export class ConfirmDeleteDocumentComponent {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDeleteDocumentComponent>);
  
  confirm() {
    this.dialogRef.close('confirmed');
  }

  closeDialog() {
    this.dialogRef.close('cancelled');
  }
}

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-angular-material',
  standalone: true,
  imports: [],
  templateUrl: './dialog-angular-material.component.html',
  styleUrl: './dialog-angular-material.component.scss'
})
export class DialogAngularMaterialComponent {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DialogAngularMaterialComponent>);
  
  confirm() {
    this.dialogRef.close('confirmed');
  }

  closeDialog() {
    this.dialogRef.close('cancelled');
  }
}
